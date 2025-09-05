import { ok, bad } from '../Response';

describe('Utils/Response (sin headers)', () => {
  it('ok() retorna 200 por defecto y body JSON', () => {
    const payload = { message: 'cita creada' };
    const res = ok(payload);

    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('string');
    expect(JSON.parse(res.body)).toEqual(payload);
  });

  it('ok() permite status custom (202)', () => {
    const res = ok({ queued: true }, 202);
    expect(res.statusCode).toBe(202);
    expect(JSON.parse(res.body)).toEqual({ queued: true });
  });

  it('bad() retorna 400 por defecto y body con error', () => {
    const res = bad('Algo salió mal');
    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);
    const msg = body.error ?? body.message;
    expect(msg).toBe('Algo salió mal');
  });

  it('bad() permite status custom (422)', () => {
    const res = bad('Payload inválido', 422);
    expect(res.statusCode).toBe(422);

    const body = JSON.parse(res.body);
    const msg = body.error ?? body.message;
    expect(msg).toBe('Payload inválido');
  });
});
