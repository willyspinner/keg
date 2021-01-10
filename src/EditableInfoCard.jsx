import React, { useState, useEffect } from 'react'
import { Tooltip, Input , Card, Typography } from 'antd'
import { PlusCircleOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'

const { TextArea } = Input;
const { Title, Paragraph } = Typography;




/* Props:
*
* onEditContents: method with json field that was edited (create / update) or deleted
*   (args) => {} where args is a json object: 
*   { edited: { 'yourFieldNameHere': value }, deleted: ['field1', 'field2'] }
* title: what to show in card title
* contents: json kv pairs of what to show.
* contentId: the unique id of the entity being edited
* isEditable (default true)
*/
/*

*/
const EditableInfoCard = ({ title, onEditContents, onDeleteCard, contentId, contents, isEditable }) => {
  const [editingValues, setEditingValues] = useState({});
  const [isCreatingNewField, setIsCreatingNewField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('')


  const onConfirmTextArea = (k) => {
  onEditContents({ edited: { [k]: editingValues[k] }})
    setEditingValues({...editingValues, [k]: undefined })
  }

  const onHandleEnterPress = (e, k) => {
    if (!e.shiftKey && ! e.ctrlKey) {
      onConfirmTextArea(k);
    }
  }

  useEffect(() => {
    setIsCreatingNewField(false);
    setEditingValues({});
    setNewFieldName('');
  }, [contentId]) // TODO: check this is correct, that it is only called when the id of the thing is changed.

  const onConfirmNewField = () => {
    if (newFieldName === '') {
      alert("please put a field name")
      return
    }
    if(contents[newFieldName]) {
      alert("field exists already.")
      return
    }
    setIsCreatingNewField(false);
    onEditContents({ edited: { [newFieldName]: '' }});
    setNewFieldName('');
  };

  const onDeleteField = (fieldName) => {
  // TODO: add a PopConfirm
    onEditContents({ deleted: [fieldName ]});
    setEditingValues({...editingValues, [fieldName]: undefined })
  }
  const onCancelCreateNewField = () => {
    setIsCreatingNewField(false);
    setNewFieldName('');
  }

  return (
    <Card
      title={title}
      extra={<DeleteOutlined style={{ fontSize: '1.3em' }} onClick={onDeleteCard}/>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems:'flex-start' }}>
        {contents && Object.keys(contents).map((k, i) => (
          <div key={i} style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                <Title underline level={5} style={{ marginRight: '0.5em'}}> {k} </Title>
                { editingValues[k] === undefined ? (
                  <EditOutlined onClick={() => setEditingValues({...editingValues, [k]: contents[k] })}/>
                ) : (
                  <>
                    <CheckOutlined style={{ marginRight: '0.5em'}} onClick={() => onConfirmTextArea(k)}/>
                    <CloseOutlined onClick={() => setEditingValues({...editingValues, [k]: undefined })}/>
                  </>
                )}
              </div>
              { k !== 'title' && (
                <DeleteOutlined onClick={() => onDeleteField(k)}/>
              )}
            </div>
            {editingValues[k] !== undefined ? (
            <TextArea
              style={{ width: '100%' }}
              defaultValue={contents[k]}
              autoSize={true}
              onPressEnter={(e) => onHandleEnterPress(e, k)}
              onChange={(e) => setEditingValues({...editingValues, [k]: e.target.value})}
            />
            ) :
              contents[k].split('\n').map((para, i) => (<Paragraph key={`para-${i}`}> {para} </Paragraph>))
            }
          </div>
        ))}
        {isCreatingNewField ? (
          <div style= {{ marginTop: '1em' }}>
            <Input
              onPressEnter={onConfirmNewField}
              placeholder="write the field name here"
              onChange={(e) => setNewFieldName(e.target.value)}
              suffix={
                <div>
                  <CheckOutlined style={{ marginRight: '0.5em'}} onClick={onConfirmNewField}/>
                  <CloseOutlined onClick={onCancelCreateNewField}/>
                </div>
              }
            />
          </div>
        ) : (
          <div style={{ marginTop: '0.5em', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Tooltip title="Click to add more attributes">
            <PlusCircleOutlined onClick={() => setIsCreatingNewField(true)} twoToneColor="#52c41a"/>
            </Tooltip>
          </div>
        )}
      </div>
    </Card>
  );
}

export default EditableInfoCard;
