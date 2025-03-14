import React from 'react';

import styles from './Scroller.module.css';

export const Scroller = React.forwardRef(function Scroller(
  {areas, disabled, setStepRef, children}, ref
) {
  if (disabled) {
    return children;
  }

  return (
    <>
      <div ref={ref}
           className={styles.scroller}>
        {Array.from({length: areas.length + 2}, (_, index) =>
          <div key={index}
               ref={setStepRef(index)}
               className={styles.step} />
        )}
        <div className={styles.sticky}>
          <div className={styles.inner}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
});
