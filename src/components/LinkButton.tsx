import { Button, ButtonProps } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithoutRef } from 'react';

export type LinkButtonProps = ButtonProps &
  ComponentPropsWithoutRef<'button'> & {
    href: string;
    title?: string;
    icon?: IconProp;
  };

export default function LinkButton({
  href,
  title = null,
  icon = null,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      {...props}
      as="a"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      variant="info"
    >
      {Boolean(icon) && <FontAwesomeIcon icon={icon} />} {title}
    </Button>
  );
}
