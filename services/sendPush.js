export async function sendPush(to, { title, body, data }) {
  try {
    const message = {
      to,
      sound: 'default',
      title: title || 'Prefeitura de Bom Conselho',
      body: body || '',
      data: data || {},
    };

    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const json = await res.json();
    return json;
  } catch (e) {
    return { error: e?.message || 'push_failed' };
  }
}

export async function sendBulk(tokens = [], payload) {
  const results = [];
  for (const t of tokens) {
    // Respeita rate-limit básico
    /* eslint-disable no-await-in-loop */
    const r = await sendPush(t, payload);
    results.push({ token: t, result: r });
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return results;
}