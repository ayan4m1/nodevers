import { ComponentPropsWithoutRef } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type LinkButtonProps = ButtonProps &
  ComponentPropsWithoutRef<'button'> & {
    href: string;
    title?: string;
    icon?: IconProp;
  };

export default function LinkButton({
  href,
  title,
  icon,
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
      {icon !== undefined && <FontAwesomeIcon icon={icon} />} {title}
    </Button>
  );
}
