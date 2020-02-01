import React from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { initializeApplication } from 'state/actions/applicationActions';
import Root from 'root';
import { GlobalState, Status } from 'types';

export default React.memo(function() {
  const applicationStatus: Status = useSelector((state: GlobalState) => state.status.initializeApplication);
  if (applicationStatus === Status.IDLE) useDispatch()(initializeApplication());

  switch (applicationStatus) {
    case Status.IDLE:
    case Status.PENDING:
      return null;
    case Status.REJECTED:
      return null;
    case Status.FULFILLED:
      return <Root />;
  }
});
