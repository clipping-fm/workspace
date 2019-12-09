import { PureComponent } from 'react';
import Runtime from './runtime';

export default class extends PureComponent {
  componentDidMount() {
    Runtime.start(document.body);
  }

  render() {
    return null;
  }
};
