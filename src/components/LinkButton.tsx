import { Button } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithoutRef } from 'react';

interface IProps extends ComponentPropsWithoutRef<'button'> {
  href: string;
  title?: string;
  icon?: IconProp;
}

export default function LinkButton({
  href,
  title = null,
  icon = null,
  ...props
}: IProps) {
  return (
    <Button
      {...props}
      as="a"
      href={href}
      rel="noopener noreferrer"
      size="sm"
      target="_blank"
      variant="info"
    >
      {title} {Boolean(icon) && <FontAwesomeIcon fixedWidth icon={icon} />}
    </Button>
  );
}
