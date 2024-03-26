export type ConfigSchema = {
  api_url: string;
};

export async function getConfig() {
  const res = await fetch('/config.json', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`
      Could not load config.json. Check that "config.json" file exists in the "public" folder.
      Please follow the instructions in the README.md file.
      Or execute this code in the console:
      'cp config.json.example public/config.json'
    `);
  }

  return (await res.json()) as ConfigSchema;
}
