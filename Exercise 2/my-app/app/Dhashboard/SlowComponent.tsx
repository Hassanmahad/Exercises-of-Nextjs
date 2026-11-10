export async function SlowComponent() {
  await new Promise((r) => setTimeout(r, 2000));
  return <p>This data was delayed 2 seconds.</p>;
}
