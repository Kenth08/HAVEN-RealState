import { useId, useState } from 'react';
import { Search } from 'lucide-react';
import { LOCATIONS, PROPERTY_TYPES } from '../../data/properties';
import { BED_OPTIONS, EMPTY_FILTERS, PRICE_STEPS } from '../../lib/filterProperties';
import { formatCompactPrice } from '../../lib/format';

function SelectField({ label, name, value, onChange, children, className = '' }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select id={id} name={name} value={value} onChange={onChange} className="field select-chevron cursor-pointer">
        {children}
      </select>
    </div>
  );
}

/**
 * Edits a draft copy of the filters; nothing changes until "Search" is
 * pressed. The parent re-keys this form when the applied filters change
 * elsewhere (e.g. a neighbourhood link), which resets the draft.
 */
export default function PropertyFilters({ initial, onApply, onReset }) {
  const [draft, setDraft] = useState(initial);
  const update = (event) => setDraft((d) => ({ ...d, [event.target.name]: event.target.value }));

  function handleSubmit(event) {
    event.preventDefault();
    let { min, max } = draft;
    if (min && max && Number(min) > Number(max)) [min, max] = [max, min];
    onApply({ ...draft, min, max });
  }

  return (
    <form role="search" aria-label="Filter homes" onSubmit={handleSubmit} className="grid grid-cols-2 items-end gap-x-6 gap-y-7 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr_auto]">
      <SelectField label="Location" name="location" value={draft.location} onChange={update} className="col-span-2 md:col-span-1">
        <option value="">Anywhere</option>
        {LOCATIONS.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </SelectField>
      <SelectField label="Type" name="type" value={draft.type} onChange={update}>
        <option value="">Any type</option>
        {PROPERTY_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </SelectField>
      <SelectField label="Bedrooms" name="beds" value={draft.beds} onChange={update}>
        <option value="">Any</option>
        {BED_OPTIONS.map((n) => (
          <option key={n} value={n}>{n}+</option>
        ))}
      </SelectField>
      <SelectField label="Min price" name="min" value={draft.min} onChange={update}>
        <option value="">No min</option>
        {PRICE_STEPS.map((p) => (
          <option key={p} value={p}>{formatCompactPrice(p)}</option>
        ))}
      </SelectField>
      <SelectField label="Max price" name="max" value={draft.max} onChange={update}>
        <option value="">No max</option>
        {PRICE_STEPS.map((p) => (
          <option key={p} value={p}>{formatCompactPrice(p)}</option>
        ))}
      </SelectField>
      <div className="col-span-2 flex items-center gap-5 md:col-span-1">
        <button type="submit" className="btn-dark flex-1 justify-center lg:flex-none">
          <Search aria-hidden="true" className="size-4" strokeWidth={1.75} />
          Search
        </button>
        <button
          type="button"
          className="link-line pb-0.5 text-sm text-mute hover:text-ink"
          onClick={() => {
            setDraft(EMPTY_FILTERS);
            onReset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
