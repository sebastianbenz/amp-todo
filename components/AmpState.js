import React from 'react';
import Head from 'next/head';

export default function AmpState(props) {
  return (
         <>
      <amp-state id={props.id}>
        <script
          type="application/json"
          dangerouslySetInnerHTML={
            {__html: JSON.stringify(props.value)}
          }>
        </script>
      </amp-state>
    </>
  );
}
