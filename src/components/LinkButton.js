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

LinkButton.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string,
  icon: PropTypes.object
};
