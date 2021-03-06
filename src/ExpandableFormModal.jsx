import React from 'react';
import { Tooltip, Input, Modal, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
const { TextArea } = Input;
const { Title } = Typography;
/*
*
* props: 
* title
* isOpen
* onSubmit
* onCancel
*
*/

export default class ExpandableFormModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: {
        title: ''
      },
      isCreatingNewField: false,
      newFieldName: '',
    }
  }

  onAddNewField = () => {
    this.setState(prevState =>({
      isCreatingNewField: true
    }));
  }
  onConfirmNewField = () => {
    if (this.state.newFieldName === '') {
      alert("please put a field name")
      return
    }
    if(this.state.fields[this.state.newFieldName]) {
      alert("field exists already.")
      return
    }
    this.setState(prevState => ({
      fields: { ...prevState.fields, [prevState.newFieldName]: '' },
      isCreatingNewField: false,
      newFieldName: '',
    }))
  }
  deleteField = (key) => {
    this.setState(prevState => {
      let newFields = prevState.fields;
      delete newFields[key];
      return { fields: newFields };
    })
  }
  onSubmit = () => {
    const fieldsToSubmit = this.state.fields;
    this.setState({
      fields: {
        title: ''
      },
      isCreatingNewField: false,
      newFieldName: '',
    }, () => this.props.onSubmit(fieldsToSubmit)
    );
  }

  onHandlePressEnter = (e) => {
    if (!e.shiftKey && ! e.ctrlKey) {
      this.onSubmit();
    }
  }

  render() {
    return (
      <Modal
      title={this.props.title}
        visible={this.props.isOpen}
        onOk={this.onSubmit}
        okText={"Ok (or press Enter)"}
        onCancel={this.props.onCancel}
      >
        {this.state.fields && Object.keys(this.state.fields).map((key) => (
          <div key={key} style= {{ marginTop: '0.5em' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Title level={5}> {key} </Title>
              { key !== 'title' &&
                <DeleteOutlined onClick={() => this.deleteField(key)} />
              }
            </div>
            <TextArea
              value={this.state.fields[key]}
              onChange={(e) => this.setState({ fields: { ...this.state.fields, [key]: e.target.value }})}
              onPressEnter={this.onHandlePressEnter}
            />
          </div>
        ))}
        {this.state.isCreatingNewField ? (
          <div style= {{ marginTop: '1em' }}>
            <Input
              onPressEnter={this.onConfirmNewField}
              placeholder="write the field name here"
              onChange={(e) => this.setState({ newFieldName: e.target.value })}
              suffix={
                <div>
                  <CheckOutlined style={{ marginRight: '0.5em'}} onClick={this.onConfirmNewField}/>
                  <CloseOutlined onClick={() => this.setState({ newFieldName: '', isCreatingNewField: false})}/>
                </div>
              }
            />
          </div>
        ) : (
          <div style={{ marginTop: '0.5em', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Tooltip title="Click to add more attributes">
              <PlusCircleOutlined onClick={this.onAddNewField} twoToneColor="#52c41a"/>
            </Tooltip>
          </div>
        )}
      </Modal>
    );
  }
}
