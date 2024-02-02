import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LinkButton({
  href,
  title = null,
  icon = null,
  ...props
}) {
  return (
    <Button
      {...props}
      as="a"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      size="sm"
      variant="info"
    >
      {title} {Boolean(icon) && <FontAwesomeIcon icon={icon} fixedWidth />}
    </Button>
  );
}

LinkButton.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string,
  icon: PropTypes.object
};
