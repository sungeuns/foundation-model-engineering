"""CPU invariants for corrected textbook examples; does not validate GPU trainers.
Run with a Python environment containing PyTorch. No models or datasets downloaded.
"""
import ast
from pathlib import Path
import re
import runpy
from tempfile import TemporaryDirectory
from xml.etree import ElementTree
from math import nextafter
from unittest.mock import Mock
import torch

ROOT = Path(__file__).resolve().parents[1] / 'src/pages'
torch.set_num_threads(1)

def definitions(slug, block=0):
    text = (ROOT / slug).read_text()
    code = re.findall(r'(?:```|~~~)python\n(.*?)(?:```|~~~)', text, re.S)[block]
    tree = ast.parse(code)
    tree.body = [n for n in tree.body if isinstance(n, (ast.Import, ast.ImportFrom, ast.FunctionDef, ast.ClassDef))]
    namespace = {}
    exec(compile(tree, slug, 'exec'), namespace)
    return namespace

for locale in ['', 'ko/']:
    q = definitions(locale+'chapter-13/quantization-methods.mdx')
    torch.manual_seed(13)
    W = torch.randn(8, 12)
    X = torch.randn(12, 40)
    H = 2*X@X.T/X.shape[1]
    out = q['gptq_core_loop'](W,H)
    assert torch.isfinite(out).all() and out.shape == W.shape
    assert torch.equal(q['gptq_core_loop'](torch.zeros_like(W),H), torch.zeros_like(W))
    # A diagonal Hessian has no cross-column compensation.
    scales = W.abs().amax(1,keepdim=True).clamp_min(1e-8)/7
    naive = (W/scales).round().clamp(-7,7)*scales
    assert torch.allclose(q['gptq_core_loop'](W,torch.eye(12)), naive)
    awq = definitions(locale+'chapter-13/quantization-methods.mdx',1)['awq_scale_weights']
    acts = torch.randn(2,5,12);acts[...,0]=0
    scaled,scale=awq(W,acts)
    assert torch.isfinite(scale).all() and (scale>0).all()
    assert torch.allclose(acts@W.T,(acts/scale)@scaled.T,atol=2e-5)
    _,scale=awq(W,torch.zeros_like(acts));assert torch.isfinite(scale).all()

    KD=definitions(locale+'chapter-13/knowledge-distillation.mdx')['ModernKDLoss']
    crit=KD(4,6)
    sl=torch.randn(2,5,13,requires_grad=True);tl=torch.randn_like(sl,requires_grad=True)
    sh=torch.randn(2,5,4,requires_grad=True);th=torch.randn(2,5,6,requires_grad=True)
    labels=torch.randint(13,(2,5));labels[1,-1]=-100
    mask=torch.zeros(2,5,dtype=torch.bool);mask[:,2:]=True
    loss=crit(sl,tl,sh,th,labels,mask);loss.backward()
    assert torch.isfinite(loss) and tl.grad is None and th.grad is None
    assert sl.grad[:,0].eq(0).all() and sl.grad[:,-1].eq(0).all()
    assert sl.grad[1,-2].eq(0).all()  # predicts padding
    sl2=sl.detach().clone();sl2[:,0]+=100;sl2[:,-1]-=100
    assert torch.allclose(loss,crit(sl2,tl,sh,th,labels,mask))
    try:crit(sl,tl,sh,th,labels,torch.zeros_like(mask))
    except ValueError:pass
    else:raise AssertionError('empty target mask accepted')

    step=definitions(locale+'chapter-11/image-diffusion-models.mdx')['ddpm_step']
    x=torch.ones(2,3,4,4);eps=torch.zeros_like(x);betas=torch.tensor([.01,.02,.03])
    a=step(x,eps,0,betas);b=step(x,eps,0,betas)
    assert torch.equal(a,b) and torch.allclose(a,x/(1-betas[0]).sqrt())
    # Cancel the reverse mean at t=2 using cumulative, not per-step alpha.
    t=2;alpha_bar=(1-betas).prod();eps=x*(1-alpha_bar).sqrt()/betas[t]
    torch.manual_seed(10);got=step(x,eps,t,betas)
    torch.manual_seed(10);expected=betas[t].sqrt()*torch.randn_like(x)
    assert torch.allclose(got,expected,atol=1e-6)

    graph_page = ROOT / locale / 'chapter-14/graphrag-and-ontology.mdx'
    graph_block = re.findall(r'```python\n(.*?)```', graph_page.read_text(), re.S)[1]
    graph_demo = {'__name__': '__main__'}
    exec(compile(graph_block, str(graph_page), 'exec'), graph_demo)
    ids, scores = graph_demo['ids'], graph_demo['scores']
    assert scores[ids['Mina']] == scores[ids['Vendor Z']] == graph_demo['cutoff']
    assert graph_demo['candidates'] == {'Orion', 'Northstar', 'Mina', 'Vendor Z'}
    follow, facts, pool = graph_demo['follow'], graph_demo['facts'], graph_demo['candidates']
    assert follow(facts, pool, 'Orion', 'ACQUIRED_BY') == [('Northstar', 'A')]
    assert follow(facts, pool, 'Northstar', 'HAS_CEO') == [('Mina', 'B')]
    assert graph_demo['memos']['A'] == 'Northstar acquired Orion.'
    assert graph_demo['memos']['B'] == "Mina is Northstar's CEO."
    assert follow(facts, pool - {'Mina'}, 'Northstar', 'HAS_CEO') == []
    Graph=graph_demo['GraphRetriever']
    graph=Graph(3,torch.tensor([[0,1],[1,2]]))
    p=torch.tensor([[1.],[0.],[0.]])
    for steps in [1,2,20,100]:
        result=graph.retrieve_subgraph(p,steps)
        assert torch.isfinite(result).all() and (result>=0).all()
        assert torch.allclose(result.sum(),torch.tensor(1.),atol=2e-6)

    Clip=definitions(locale+'chapter-11/vision-language-bridges.mdx')['CLIPLoss']
    clip=Clip();e=torch.eye(4);good=clip(e,e);bad=clip(e,e.roll(1,0))
    assert good < bad and clip.logit_scale.exp()>0
    bad.backward();assert torch.isfinite(clip.logit_scale.grad)

    cot=definitions(locale+'chapter-15/chain-of-thought.mdx')
    select,verify=cot['select_majority'],cot['verify_bolt_answer']
    for answers,expected in [([33,33,33,29,29],33),([29,29,29,33,33],29),([33,29],None)]:
        result=select([{'answer':a} for a in answers]);assert result['answer']==expected
        assert verify(result['answer'])==(expected==33)
    malformed=select([{'answer':33},{'answer':33},{},{},{'answer':True}])
    assert malformed['answer'] is None and malformed['valid']==2 and malformed['attempted']==5
    assert select([{'answer':33,'extra':0},'33',None])['valid']==0
    try:select([])
    except ValueError:pass
    else:raise AssertionError('empty sample pool accepted')
    print(f'{locale or "en/"}: GPTQ, AWQ, KD masking, DDPM, RWR, CLIP and CoT voting/verification invariants passed')


# KTO bounded loss is intentionally a semantic sketch; evaluate its exact expressions.
for locale in ['', 'ko/']:
    text=(ROOT/(locale+'chapter-10/kto-and-ipo.mdx')).read_text()
    expressions=re.findall(r'^(loss_(?:un)?desirable) = (.*)$',text,re.M)
    assert len(expressions)==2
    value=torch.linspace(-100,100,51,requires_grad=True)
    env=dict(torch=torch,beta=.1,value=value,lambda_desirable=2.,lambda_undesirable=3.)
    vals={name:eval(expr,env) for name,expr in expressions}
    assert (vals['loss_desirable']>=0).all() and (vals['loss_desirable']<=2).all()
    assert (vals['loss_undesirable']>=0).all() and (vals['loss_undesirable']<=3).all()
    grad=torch.autograd.grad(vals['loss_desirable'].sum(),value,retain_graph=True)[0]
    assert (grad<=0).all()
    grad=torch.autograd.grad(vals['loss_undesirable'].sum(),value)[0]
    assert (grad>=0).all()
print('EN/KO bounded KTO objective and gradient directions passed')

for locale in ['', 'ko/']:
    ptq = definitions(locale+'chapter-13/ptq-vs-qat.mdx')['PTQLinear'](4,3)
    with torch.no_grad(): ptq.weight.zero_()
    ptq.calibrate(torch.zeros(2,4))
    assert torch.isfinite(ptq(torch.zeros(2,4))).all()
    PTQLinear = type(ptq)
    calibrated = PTQLinear(1, 1)
    with torch.no_grad():
        calibrated.weight.fill_(1)
    for peak in (2., .25):
        calibrated.calibrate(torch.tensor([[peak]]))
    # A fresh layer must retain the larger first batch after a save/load round trip.
    with TemporaryDirectory() as folder:
        path = Path(folder) / 'calibrated.pt'
        torch.save(calibrated.state_dict(), path)
        restored = PTQLinear(1, 1)
        restored.load_state_dict(torch.load(path, map_location='cpu', weights_only=True))
        torch.testing.assert_close(restored.act_scale, torch.tensor(2 / 127))
        actual = restored(torch.tensor([[1.], [3.]]))
        torch.testing.assert_close(actual, torch.tensor([[128 / 127], [2.]]))
    q = definitions(locale+'chapter-13/ptq-vs-qat.mdx',1)
    v=torch.tensor([-10.,0.,10.],requires_grad=True)
    q['fake_quantize'](v,torch.tensor(1.),bits=3).sum().backward()
    assert torch.equal(v.grad,torch.tensor([0.,1.,0.]))
    fixture = torch.tensor([-2., -1.25, -.75, 0., .25, 1.25, 1.6, 2.], requires_grad=True)
    native_input = fixture.detach().clone().requires_grad_()
    simulated = q['fake_quantize'](fixture, .5, bits=3)
    native = torch.fake_quantize_per_tensor_affine(native_input, .5, 0, -3, 3)
    torch.testing.assert_close(simulated, native)
    simulated.sum().backward()
    native.sum().backward()
    torch.testing.assert_close(fixture.grad, native_input.grad)
    layer=q['QATLinear'](4,3);layer(torch.ones(2,4)).sum().backward()
    assert torch.isfinite(layer.weight.grad).all()
    Patch=definitions(locale+'chapter-11/video-generation-foundations.mdx')['SpacetimePatchEmbed']
    patch=Patch(in_channels=2,embed_dim=8)
    assert patch(torch.zeros(1,2,4,6,8)).shape==(1,24,8)
    try:patch(torch.zeros(1,2,3,6,8))
    except ValueError:pass
    else:raise AssertionError('silently discarded latent boundary')
print('EN/KO zero-scale quantization, clipped STE gradients and video patch boundaries passed')

for locale in ['', 'ko/']:
    ns=definitions(locale+'chapter-20/multi-token-prediction.mdx')
    fn=ns['compute_mtp_loss']
    logits=torch.randn(2,4,5,7,requires_grad=True)
    targets=torch.randint(7,(2,5));targets[1,-1]=-100
    mask=torch.tensor([[False,True,True,True,True],[False,True,True,False,False]])
    seg=torch.tensor([[0,0,0,1,1],[0,0,0,-1,-1]])
    loss=fn(logits,targets,[1.,.5,.25,.1],mask,seg);loss.backward()
    assert torch.isfinite(loss)
    assert logits.grad[0,0,2].eq(0).all()  # predicts a different packed segment
    assert logits.grad[1,:,2:].eq(0).all() # no labeled future targets
    assert logits.grad[:,:,-1].eq(0).all()
    try:fn(logits,targets,[1.]*4,torch.zeros_like(mask),seg)
    except ValueError:pass
    else:raise AssertionError('empty MTP targets accepted')
    short=torch.randn(1,4,1,7,requires_grad=True)
    try:fn(short,torch.zeros(1,1,dtype=torch.long),[1.]*4,torch.ones(1,1,dtype=torch.bool),torch.zeros(1,1,dtype=torch.long))
    except ValueError:pass
    else:raise AssertionError('empty shifted sequence accepted')

    ns=definitions(locale+'chapter-15/verifiers-and-reward-models.mdx')
    from types import SimpleNamespace
    class DummyBase(torch.nn.Module):
        def forward(self,input_ids,attention_mask,output_hidden_states,use_cache):
            h=torch.nn.functional.one_hot(input_ids%4,4).to(torch.bfloat16)
            return SimpleNamespace(hidden_states=[h])
    model=ns['ProcessRewardModel'](DummyBase(),4)
    ids=torch.tensor([[0,1,2,3],[1,2,0,0]])
    attn=torch.tensor([[1,1,1,1],[1,1,0,0]])
    ends=torch.tensor([[1,3],[1,-1]]);valid=torch.tensor([[1,1],[1,0]],dtype=torch.bool)
    logits,got=model(ids,attn,ends,valid)
    labels=torch.tensor([[1.,0.],[1.,float('nan')]])
    loss=ns['masked_step_loss'](logits,labels,got);loss.backward()
    assert torch.isfinite(loss) and torch.isfinite(model.score_head.weight.grad).all()
    try:model(ids,attn,torch.tensor([[1,3],[2,-1]]),valid)
    except ValueError:pass
    else:raise AssertionError('padding boundary accepted')
print('EN/KO MTP offsets/segment masks/empty targets and PRM padding/dtype invariants passed')

for locale in ['', 'ko/']:
    ns=definitions(locale+'chapter-19/probing-classifiers.mdx')
    train=torch.tensor([[10.,1.],[11.,1.],[20.,1.],[21.,1.]],dtype=torch.bfloat16,requires_grad=True)
    labels=torch.tensor([0,0,1,1])
    probe,accuracy=ns['fit_linear_probe'](train,labels,train,labels,steps=5)
    fresh=ns['LinearProbe'](2,2);fresh.load_state_dict(probe.state_dict())
    assert torch.equal(probe(train),fresh(train)) and train.grad is None
    assert torch.isfinite(probe(train)).all() and probe.scale[0,1]>0
    assert accuracy==(probe(train).argmax(-1)==labels).float().mean().item()
    fn=definitions(locale+'chapter-20/multi-token-prediction.mdx')['compute_mtp_loss']
    # Summing these finite half-precision logits overflows in fp16; selected CE is finite.
    logits=torch.full((1,2,5,100),1000.,dtype=torch.float16,requires_grad=True)
    loss=fn(logits,torch.zeros(1,5,dtype=torch.long),[1.,1.],torch.ones(1,5,dtype=torch.bool),torch.zeros(1,5,dtype=torch.long))
    assert torch.isfinite(loss)
    loss.backward();assert torch.isfinite(logits.grad).all()
print('EN/KO probe artifact preprocessing and fp16 MTP reduction invariants passed')

for locale in ['', 'ko/']:
    ns=definitions(locale+'chapter-15/tree-graph-of-thoughts.mdx')
    class FakeExecutor:
        def generate(self,prompt,**kwargs):
            assert 'ROOT TASK' in prompt
            if 'Score from' in prompt:return ['0.6']
            return ['candidate '+str(i) for i in range(kwargs.get('num_return_sequences',1))]
    controller=ns['GoTController'](FakeExecutor())
    assert isinstance(controller.execute_search('ROOT TASK'),str)
    class BadJudge:
        def generate(self,*args,**kwargs):return ['nan']
    controller.llm=BadJudge()
    try:controller.score_nodes([ns['GoTNode']('ROOT TASK')])
    except ValueError:pass
    else:raise AssertionError('nonfinite evaluator score accepted')
    Router=definitions(locale+'chapter-16/multi-agent-collaboration.mdx')['MultiAgentAttentionRouter']
    router=Router(16,4).eval();query=torch.randn(2,3,16);workers=torch.randn(2,5,16)
    mask=torch.zeros(2,5,dtype=torch.bool);mask[:,-2:]=True
    out,attn=router(query,workers,mask);changed=workers.clone();changed[:,-2:]=1e5
    out2,_=router(query,changed,mask)
    assert torch.allclose(out,out2,atol=1e-6) and attn[:,:,-2:].eq(0).all()
    try:router(query,workers,torch.ones_like(mask))
    except ValueError:pass
    else:raise AssertionError('all-padding worker pool accepted')
    Counter=definitions(locale+'chapter-20/neural-networks-as-programs.mdx')['NeuralCounter']
    counter=Counter(2,8,1).double();x=torch.randn(2,5,2,dtype=torch.float64)
    full,h=counter(x);first,state=counter(x[:,:2]);second,_=counter(x[:,2:],state)
    assert torch.allclose(full,torch.cat([first,second],1),atol=1e-10)
print('EN/KO GoT task history, judge rejection, worker padding and recurrent-state continuation passed')

# Both editions render the downloadable Python file as their SDPA code block.
example = runpy.run_path(str(ROOT.parents[1] / 'public/labs/prefix_mask.py'))
mask = example['allowed']
assert mask.dtype == torch.bool
leak = [example['attend'](example[name], mask.float())[3] for name in ('values', 'changed')]
torch.testing.assert_close(torch.stack(leak), torch.tensor([3.257, 10.465]), atol=.001, rtol=0)
for locale in ['', 'ko/']:
    lesson = ROOT / f'{locale}chapter-4/hybrid-prefix-lm.mdx'
    lang = 'ko' if locale else 'en'
    assert f'<PrefixMaskExample lang="{lang}" />' in lesson.read_text()
    card = ElementTree.parse(ROOT.parents[1] / 'public/social' / f'prefix-mask-{lang}.svg')
    labels = {label.text for label in card.iter('{http://www.w3.org/2000/svg}text')}
    assert f"{example['output'][3]:.1f} → {example['new_output'][3]:.1f}" in labels
    assert f'{leak[0]:.3f} → {leak[1]:.3f}' in labels
    print(f'{locale or "en/"}: prefix visibility and additive-mask leakage verified')

# Filtered tokens have zero probability, even at the upper RNG boundary.
upper_boundary = Mock()
upper_boundary.random.return_value = nextafter(1.0, 0.0)
for locale in ['', 'ko/']:
    sampler = definitions(locale + 'chapter-12/speculative-decoding.mdx')
    filtered = [0.1] * 10 + [0.0, 0.0]
    assert sampler['draw'](filtered, upper_boundary) == 9
    committed, accepted = sampler['verify_draft_tokens'](
        [[0.0, 1.0]], [[1.0, 0.0], [0.0, 1.0]], [1], upper_boundary
    )
    assert (committed, accepted) == ([0], 0)
print('EN/KO speculative sampling respects zero-probability tokens and disjoint support')
