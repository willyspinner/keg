import React from 'react';
import { Modal, Input } from 'antd';

class ExpandableFormModal extends 
        <Modal
          title="Add a new node"
          visible={this.state.nodeModalIsOpen}
          onOk={this.onSubmitCreateNode}
          onCancel={() => this.setState({nodeModalIsOpen: false})}
        >
