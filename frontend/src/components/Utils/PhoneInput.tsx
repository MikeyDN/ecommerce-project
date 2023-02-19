import React from 'react'
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from 'ariakit'
import { countryCodes } from '../../lib/countrycodes'

export function PhoneInput({
  value,
  setPhone,
}: {
  value: string
  setPhone: Function
}) {
  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryCodes.map((country) => country.dial_code),
    defaultValue: '+972',
  })
  const phone = value.slice(combobox.value.length)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    var onlyNums = value.replace(/[^\d]/g, '')
    if (onlyNums.startsWith('0')) {
      setPhone(combobox.value + onlyNums.slice(1))
    } else {
      setPhone(combobox.value + onlyNums)
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Combobox
        state={combobox}
        placeholder="e.g., Apple"
        className="combobox"
        style={{ width: '17.5%' }}
      />
      <ComboboxPopover state={combobox} className="popover">
        {combobox.matches.length ? (
          combobox.matches.map((value) => (
            <ComboboxItem key={value} value={value} className="combobox-item" />
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </ComboboxPopover>
      <input
        className="combobox"
        type="text"
        name="phone"
        placeholder="Phone Number"
        maxLength={10}
        style={{ width: '40%' }}
        value={phone}
        onChange={handleChange}
        required
      />
    </div>
  )
}
