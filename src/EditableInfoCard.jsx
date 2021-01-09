import React, { useState, useEffect } from 'react'
import { Input , Card, Typography } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const { TextArea } = Input;
const { Title, Paragraph } = Typography;




/* Props:
*
* onEditContents: method with json field that was edited as arg
* title: what to show in card title
* contents: json kv pairs of what to show.
* isEditable (default true)
*  TODO: idea: toggle isEditable using a button (in the component controlling this)
*/
/*

<Paragraph editable onChange={(s) => onEditContents({ [k] : s })}> {contents[k]} </Paragraph>

*/
const EditableInfoCard = ({ title, onEditContents, contents, isEditable }) => {
  const [editingValues, setEditingValues] = useState({});

  const onConfirmTextArea = (k) => {
    onEditContents({ [k]: editingValues[k] })
    setEditingValues({...editingValues, [k]: undefined })
    console.log("KK")
  }
  return (
    <Card title={title}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems:'flex-start' }}>
      {contents && Object.keys(contents).map((k, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Title underline level={5} style={{ marginRight: '0.5em'}}> {k} </Title>
              { editingValues[k] === undefined &&
                <EditOutlined onClick={() => setEditingValues({...editingValues, [k]: contents[k] })}/>
              }
            </div>
            {editingValues[k] ? (
            <TextArea 
              defaultValue={contents[k]}
              onChange={(e) => setEditingValues({...editingValues, [k]: e.target.value})}
              onPressEnter={() => onConfirmTextArea(k)}
            />
            ) : (
              <Paragraph> {contents[k]} </Paragraph>
            )}
          </div>
          ))}
      </div>
    </Card>
  );
}

export default EditableInfoCard;
