import {
  faSort,
  faSortAsc,
  faSortDesc
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  useCallback,
  useState,
  PropsWithChildren,
  ComponentProps
} from 'react';
import { Button, Col, ColProps } from 'react-bootstrap';

interface SortIconProps {
  initiallyActive?: boolean;
  active: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function SortIcon({
  initiallyActive = null,
  active,
  onClick,
  children,
  ...props
}: PropsWithChildren<SortIconProps> & ColProps & ComponentProps<'div'>) {
  const [toggled, setToggled] = useState(initiallyActive);
  const onToggle = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setToggled((state) => !state);
      onClick(event);
    },
    [onClick]
  );

  return (
    <Col {...props}>
      {children}
      <Button
        className="ms-2"
        onClick={onToggle}
        size="sm"
        variant="outline-primary"
      >
        <FontAwesomeIcon
          fixedWidth
          icon={
            toggled === null || !active
              ? faSort
              : toggled
                ? faSortAsc
                : faSortDesc
          }
        />
      </Button>
    </Col>
  );
}
