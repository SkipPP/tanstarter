export function requireEnv<const TNames extends readonly string[]>(
  names: TNames,
): { [K in TNames[number]]: string } {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variable(s): ${missing.join(", ")}`);
  }

  return Object.fromEntries(names.map((name) => [name, process.env[name]!])) as {
    [K in TNames[number]]: string;
  };
}
