import reducer, { setTimezone } from '@/redux/features/locationSlice';

describe('locationSlice', () => {
    it('returns initial state', () => {
        expect(reducer(undefined, { type: '@@INIT' }))
            .toEqual({ timezone: 'America/New_York' })
    })

    it('setTimezone updates timezone', () => {
        const result = reducer({ timezone: 'America/New_York' }, setTimezone('America/Chicago'));
        expect(result.timezone).toBe('America/Chicago')
    })

    it('setTimezone replaces previous value', () => {
        const after1 = reducer({ timezone: 'America/New_York' }, setTimezone('America/Chicago'))
        const after2 = reducer(after1, setTimezone('America/Los_Angeles'))
        expect(after2.timezone).toBe('America/Los_Angeles')
    })
})