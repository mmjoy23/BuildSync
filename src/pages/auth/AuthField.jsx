import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Icon from '../../components/common/Icon';

export default function AuthField({ label, type = 'text', ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  return <div className="auth-field"><label htmlFor={props.id}>{label}</label><div className="auth-field__control"><Input {...props} id={props.id} type={isPassword && !visible ? 'password' : 'text'} />{isPassword && <button type="button" className="auth-field__toggle" onClick={() => setVisible((value) => !value)} aria-label={visible ? `Hide ${label}` : `Show ${label}`} title={visible ? 'Hide password' : 'Show password'}><Icon name={visible ? 'eye-off' : 'eye'} size={17} /></button>}</div></div>;
}
