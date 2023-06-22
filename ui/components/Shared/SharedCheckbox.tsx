import classNames from "classnames"
import React, { ReactElement } from "react"

type Props = {
  label?: string
  labelPosition?: "left" | "right"
  size?: number
  checked: boolean
  disabled?: boolean
  invalid?: boolean
  invalidMessage?: string
  customStyles?: React.CSSProperties
  onChange: (value: boolean) => void
}

export default function SharedCheckbox(props: Props): ReactElement {
  const {
    label,
    labelPosition = "right",
    size = 16,
    checked,
    disabled,
    invalid,
    invalidMessage,
    customStyles,
    onChange,
  } = props

  const labelElement = (
    <>
      <span
        style={customStyles}
        className={classNames("label", {
          disabled,
        })}
      >
        {label}
      </span>
      <style jsx>
        {`
          .label {
            cursor: pointer;
            color: var(--green-5);
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
          }

          .label.disabled {
            color: var(--green-60);
            cursor: default;
          }
        `}
      </style>
    </>
  )

  return (
    <div
      className={classNames({
        container: invalidMessage,
      })}
    >
      <label className="checkbox_label">
        <input
          className="checkbox_input"
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
        {labelPosition === "left" && labelElement}
        <div
          className={classNames("checkbox_box", {
            checked,
            disabled,
            invalid: !disabled && invalid,
          })}
        />
        {labelPosition === "right" && labelElement}
      </label>
      <span
        className={classNames("message", {
          visible: !disabled && invalidMessage && invalid,
        })}
      >
        {invalidMessage}
      </span>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .checkbox_label {
          display: flex;
          flex-direction: row;
          margin: unset;
          gap: 8px;
        }

        .checkbox_input {
          display: none;
        }

        .checkbox_box {
          min-width: ${size}px;
          height: ${size}px;
          border-radius: 2px;
          box-sizing: border-box;
          cursor: pointer;
          margin-top: ${label ? 4 : 0}px;
        }

        .checkbox_box.disabled {
          background: var(--green-80);
          cursor: default;
        }

        .checkbox_box:not(.checked) {
          border: 2px solid var(--green-60);
        }

        .checkbox_box.checked {
          background-color: var(--trophy-gold);
        }

        .checkbox_box.invalid {
          border: 2px solid var(--error);
        }

        .checkbox_box.checked::before {
          content: "";
          display: block;
          margin: ${size * 0.2}px;
          width: ${size * 0.6}px;
          height: ${size * 0.6}px;
          background: no-repeat center / cover url("/images/checkmark@2x.png");
        }

        .message {
          visibility: hidden;
          color: var(--error);
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
        }

        .message.visible {
          visibility: visible;
        }
      `}</style>
    </div>
  )
}
