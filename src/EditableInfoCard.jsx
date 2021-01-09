import React from 'react'
import { Card } from 'antd'

/* Props:
*
* onEditContents: method with json field that was edited as arg
* title: what to show in card title
* contents: json kv pairs of what to show.
* isEditable (default true)
*  TODO: idea: toggle isEditable using a button (in the component controlling this)
*/
const EditableInfoCard = ({ title, onEditContents, contents, isEditable }) => {
  return (
    <Card title={title}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems:'flex-start' }}>
        {contents && Object.keys(contents).map((k) => (
          <p> {k}: {contents[k]} </p>
        ))}
      </div>
    </Card>
  );
}

export default EditableInfoCard;
