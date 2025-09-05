
import { validateCreate } from '../Validate';

describe('validateCreate', () => {
  it('acepta payload válido', () => {
    expect(() =>
      validateCreate({ insuredId: '01234', scheduleId: 100, countryISO: 'PE' })
    ).not.toThrow();
  });

  it('falla si insuredId no tiene 5 dígitos', () => {
    expect(() =>
      validateCreate({ insuredId: '123', scheduleId: 100, countryISO: 'PE' })
    ).toThrow();
  });

  it('falla si scheduleId no es number', () => {
    expect(() =>
      validateCreate({ insuredId: '01234', scheduleId: 'X' as any, countryISO: 'PE' })
    ).toThrow();
  });

  it('falla si countryISO no es PE o CL', () => {
    expect(() =>
      validateCreate({ insuredId: '01234', scheduleId: 100, countryISO: 'AR' as any })
    ).toThrow();
  });
});
