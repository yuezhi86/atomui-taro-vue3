export default function (config, configName) {
  const keys = configName.split('.');
  return keys.reduce((parent, key) => {
    if (!parent) return;
    return parent[key];
  }, config);
}
