const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

export const normalizePathname = (pathname) => {
  if (!pathname) return '/';
  const normalized = trimTrailingSlash(pathname);
  return normalized || '/';
};

export const getBasePath = () => normalizePathname(import.meta.env.BASE_URL || '/');

export const stripBasePath = (pathname, basePath = getBasePath()) => {
  const normalizedPath = normalizePathname(pathname);

  if (basePath === '/') return normalizedPath;
  if (normalizedPath === basePath) return '/';
  if (normalizedPath.startsWith(`${basePath}/`)) {
    return normalizePathname(normalizedPath.slice(basePath.length));
  }

  return normalizedPath;
};

export const withBasePath = (pathname, basePath = getBasePath()) => {
  const normalizedPath = normalizePathname(pathname);

  if (basePath === '/') return normalizedPath;
  if (normalizedPath === '/') return basePath;
  return `${basePath}${normalizedPath}`;
};
