import React, { useState, useEffect } from 'react'
import { Input , Card, Typography } from 'antd'
import { DeleteOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'

const { TextArea } = Input;
const { Title, Paragraph } = Typography;




/* Props:
*
* onEditContents: method with json field that was edited as arg
* title: what to show in card title
* contents: json kv pairs of what to show.
* isEditable (default true)
*/
/*

*/
const EditableInfoCard = ({ title, onEditContents, onDeleteCard, contents, isEditable }) => {
  const [editingValues, setEditingValues] = useState({});

  const onConfirmTextArea = (k) => {
    onEditContents({ [k]: editingValues[k] })
    setEditingValues({...editingValues, [k]: undefined })
  }
  return (
    <Card
      title={title}
      extra={<DeleteOutlined style={{ fontSize: '1.3em' }} onClick={onDeleteCard}/>}
    >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems:'flex-start' }}>
      {contents && Object.keys(contents).map((k, i) => (
          <div key={i} style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
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
            {editingValues[k] !== undefined ? (
            <TextArea
              style={{ width: '100%' }}
              defaultValue={contents[k]}
              autoSize={true}
              onChange={(e) => setEditingValues({...editingValues, [k]: e.target.value})}
            />
            ) :
              contents[k].split('\n').map((para, i) => (<Paragraph key={`para-${i}`}> {para} </Paragraph>))
            }
          </div>
          ))}
      </div>
    </Card>
  );
}

export default EditableInfoCard;
