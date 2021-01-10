import * as React from 'react';
import { Input, Button, Modal, Select, Divider, Typography } from 'antd';
import EditableInfoCard from './EditableInfoCard';
import ExpandableFormModal from './ExpandableFormModal';
import { DeleteOutlined, PlusOutlined, PlusSquareTwoTone } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid';

import  GraphView from 'react-digraph'
import GraphConfig, {
  edgeTypes,
  EMPTY_EDGE_TYPE,
  EMPTY_TYPE,
  NODE_KEY,
  nodeTypes,
  COMPLEX_CIRCLE_TYPE,
  POLY_TYPE,
  SPECIAL_CHILD_SUBTYPE,
  SPECIAL_EDGE_TYPE,
  SPECIAL_TYPE,
  SKINNY_TYPE,
  graphSample,
} from './graph-config'; // Configures node/edge types


const { Title, Text } = Typography;

const { Option } = Select;

const keyMap = {
  DELETE_OBJECT: "shift+x",
}

// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.



export default class Graph extends React.Component {

  constructor(props) {
    super(props);
    /* SEE HERE: This is the way we save it in localStorage */
    const defaultSave  = {
      projects: {
        'sample_project_id': {
          graph: graphSample,
          name: 'sample project'
        },
      },
      currentProjectId: 'sample_project_id'
    };

    const appSave = JSON.parse(localStorage.existingSave || 'null') || defaultSave

    this.state = {
      copiedNode: null,
      currentProjectId: appSave.currentProjectId,
      layoutEngineType: undefined,
      selected: null,
      newProjectName: '',
      projects: appSave.projects,
      candidateNewObject: null,
      isCreatingNewProject: false,
    };

    this.GraphView = React.createRef();
  }

  // Helper to find the index of a given node
  getNodeIndex(searchNode: INode | any) {
    return this.state.projects[this.state.currentProjectId].graph.nodes.findIndex(node => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge: IEdge) {
    return this.state.projects[this.state.currentProjectId].graph.edges.findIndex(edge => {
      return (
        edge.source === searchEdge.source && edge.target === searchEdge.target
      );
    });
  }

  // Given a nodeKey, return the corresponding node
  getViewNode(nodeKey: string) {
    const searchNode = {};

    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);

    return this.state.projects[this.state.currentProjectId].graph.nodes[i];
  }


  /*
   * Handlers/Interaction
   */

  saveLocalStorage = () => {
    localStorage.existingSave = JSON.stringify({
      projects: this.state.projects,
      currentProjectId: this.state.currentProjectId,
    });
  }

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = (viewNode: INode) => {
    const projectId = this.state.currentProjectId;
    const graph = this.state.projects[projectId].graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState(prevState => {
      let newProjects = prevState.projects;
      newProjects[projectId].graph = graph;
      return {
        projects: newProjects,
      };
    }, () => {
      this.saveLocalStorage()
    });
  };

  onUpdateEdge = (viewEdge: IEdge) => {
    const projectId = this.state.currentProjectId;
    const graph = this.state.projects[projectId].graph;
    const i = this.getEdgeIndex(viewEdge);
    graph.edges[i] = viewEdge;
    this.setState(prevState => {
      let newProjects = prevState.projects;
      newProjects[projectId].graph = graph;
      return {
        projects: newProjects,
      };
    }, () => {
      this.saveLocalStorage()
    });
  };
  // Node 'mouseUp' handler
  onSelectNode = (viewNode: INode | null) => {
    // Deselect events will send Null viewNode
    if (viewNode) {
      this.setState({ selected: { ...viewNode, objectType: 'node' }});
    } else {
      this.setState({ selected: null })

    }
  };

  // Edge 'mouseUp' handler
  onSelectEdge = (viewEdge: IEdge) => {
  this.setState({ selected: { ...viewEdge, objectType: 'edge' }});
  };

  // Updates the graph with a new node
  onCreateNode = (x: number, y: number, mouseEvt) => {
    console.log("ON CREATE NODE CALLEd", x, y, mouseEvt)
    this.setState({
      formModalIsOpen: true,
      candidateNewObject: {
        x,
        y,
        name: '',
        objectType: 'node',
      } /* used to be newNode */
    })

  };

  onSubmitCreateNode = (fields) => {
    //const type = Math.random() < 0.25 ? SPECIAL_TYPE : EMPTY_TYPE;
    const type = EMPTY_TYPE;
    const { x, y } = this.state.newNode || {};
    const graph = this.state.projects[this.state.currentProjectId].graph;
    const node = {
      id: uuidv4(),
      title: fields.title,
      fields, 
      type,
      x,
      y,
    };

    graph.nodes = [...graph.nodes, node];
    this.setState(prevState => {
      const newProjects = prevState.projects;
      newProjects[prevState.currentProjectId].graph = graph;
      return {
        projects: newProjects,
        formModalIsOpen: false,
      };
    }, () => {
      this.saveLocalStorage()
    });
  }

  onNewNodeChange = (newMappings) => {
    this.setState((prevState) => ({
      newNode: {
        ...prevState.newNode,
        ...newMappings
      }
    }))
  }

  // Deletes a node from the graph
  onDeleteNode = (viewNode: INode /*,nodeId: string, nodeArr: INode[]*/) => {
    console.log("CALLED")
    const graph = this.state.projects[this.state.currentProjectId].graph;
    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => {
      return (
        edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY]
      );
    });

    graph.nodes = graph.nodes.filter((n) => n[NODE_KEY] !== viewNode[NODE_KEY]);
    graph.edges = newEdges;

    this.setState(prevState => {
      let newProjects = prevState.projects;
      newProjects[prevState.currentProjectId].graph = graph;
      return {
        projects: newProjects,
        selected: null
        };
    });
    this.saveLocalStorage()
  };
  onSubmitCreateObject = (fields) => {
    if (!this.state.candidateNewObject) {
      console.error("No candidateNewObject state when onSubmitCreateObject() was called.")
      return
    }
    if (this.state.candidateNewObject.objectType === 'node') {
      this.onSubmitCreateNode(fields)
    } else {
      this.onSubmitCreateEdge(fields)
    }

  }

  onDeleteObject = (selectedObject) => {
    if (selectedObject.objectType === 'node') {
      this.onDeleteNode(selectedObject)
    } else {
      this.onDeleteEdge(selectedObject)
    }
  }

  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
    const graph = this.state.projects[this.state.currentProjectId].graph;
    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      objectType: 'edge',
      fields: {},
      handleText: 'edge' // TODO: make this customizable?
    };

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      this.setState({
        candidateNewObject: viewEdge,
        formModalIsOpen: true,
      })
    }
  };

  onSubmitCreateEdge = (fields) => {
    const graph = this.state.projects[this.state.currentProjectId].graph;
    const edge = {
      ...this.state.candidateNewObject,
      fields,
      handleText: fields.title,
      id: uuidv4(),
    }
    graph.edges = [...graph.edges, edge];
    this.setState(prevState => {
      const newProjects = prevState.projects;
      newProjects[prevState.currentProjectId].graph = graph;
      return {
        projects: newProjects,
        selected: edge,
        formModalIsOpen: false,
      };
    }, () => {
      this.saveLocalStorage()
    });

  }

  // Called when an edge is reattached to a different target.
  onSwapEdge = (
    sourceViewNode: INode,
    targetViewNode: INode,
    viewEdge: IEdge
  ) => {
    const graph = this.state.projects[this.state.currentProjectId].graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference if you want the graph to re-render a swapped edge
    graph.edges = [...graph.edges];

    this.setState({
      graph,
      selected: edge,
    });
    this.saveLocalStorage()
  };

  // Called when an edge is deleted
  onDeleteEdge = (viewEdge: IEdge) => {
    this.setState(prevState => {
      const graph = prevState.projects[prevState.currentProjectId].graph;
      graph.edges = graph.edges.filter((e) => e.id !== viewEdge.id);
      let newProjects = prevState.projects;
      newProjects[prevState.currentProjectId].graph = graph;
      return {
        projects: newProjects,
        selected: null
        };
    });
    this.saveLocalStorage()
  };

  onUndo = () => {
    // Not implemented
    console.warn('Undo is not currently implemented in the example.');
    // Normally any add, remove, or update would record the action in an array.
    // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
    // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
    // into the edges array at position i.
  };

  onCopySelected = () => {
    if (this.state.selected.source) {
      console.warn('Cannot copy selected edges, try selecting a node instead.');

      return;
    }

    const x = this.state.selected.x + 10;
    const y = this.state.selected.y + 10;

    this.setState({
      copiedNode: { ...this.state.selected, x, y },
    });
  };

  // Pastes the selected node to mouse position
  onPasteSelected = (node: INode, mousePosition?: [number, number]) => {
    const graph = this.state.projects[this.state.currentProjectId].graph;

    const newNode = {
      ...node,
      id: uuidv4(),
      x: mousePosition ? mousePosition[0] : node.x,
      y: mousePosition ? mousePosition[1] : node.y,
    };

    graph.nodes = [...graph.nodes, newNode];
    this.setState(prevState => {
      const newProjects = prevState.projects;
      newProjects[prevState.currentProjectId].graph = graph;
      return { projects: newProjects };
    }, () => this.forceUpdate());
  };

  handleChangeLayoutEngineType = (event: any) => {
    this.setState({
      layoutEngineType: (event.target.value: LayoutEngineType | 'None'),
    });
  };

  onSelectPanNode = (event: any) => {
    if (this.GraphView) {
      this.GraphView.panToNode(event.target.value, true);
    }
  };

  renderNodeText = (data, id, isSelected) => {
    // TODO: customise node text here
    // TODO: this is buggy.
    return (
      <text x='-40' y='0'> {data.fields? data.fields.title: data.title} </text>
    )
  }

   onEditCardContents = (editedFields) => {
     this.setState(prevState => ({
       selected: {
         ...prevState.selected,
         fields: {
           ...prevState.selected.fields,
           ...editedFields
         },
       }
     }), () => {
       // TODO: BUG:PROBLEM in onUpdateNode. made it deselect as soon as card content edited.
       if (this.state.selected.objectType === 'node') {
         this.onUpdateNode({ ...this.state.selected, title: this.state.selected.fields.title });
       } else {
         // we create this because we are editing the card contents of the edge.
         this.onUpdateEdge({ ...this.state.selected, handleText: this.state.selected.fields.title }) 
       }
     })
   }
  onAddNewProject = () => {
    if(this.state.newProjectName === '') {
      alert("Invalid new project name");
      return;
    }
    const newProjectId = uuidv4();
    console.log("CREATING NEW PRJ", newProjectId, this.state.newProjectName)
    this.setState(prevState => ({
      newProjectName: '',
      selected: null, 
      projects: {
        ...prevState.projects,
        [newProjectId]: {
          name: prevState.newProjectName,
          graph: {
            nodes: [],
            edges: [],
          }
        }
      },
      currentProjectId: newProjectId,
      isCreatingNewProject: false,
    }), () => {
      this.saveLocalStorage()
    })
  }
  handleDeleteProject = () => {
    // delete currently selected project.
    this.setState(prevState => {
      const newProjects = prevState.projects;
      const deleteProjectId = prevState.currentProjectId;
      delete newProjects[deleteProjectId];
      const selectedProjectId = Object.keys(newProjects)[0] || '';
      return {
        projects: newProjects,
        currentProjectId: selectedProjectId,
        deleteProjectModalIsOpen: false,
      }
    }, () => {
      this.saveLocalStorage();
    })
  }
  onCancelAddObject = () => {
    this.setState({
      formModalIsOpen: false,
      candidateNewObject: null,
    });
  }

  render() {
    const modals = (
      <>
        <Modal
          visible={this.state.isCreatingNewProject}
          title="Create a new project"
          onOk={this.onAddNewProject}
          onCancel={() => this.setState({ isCreatingNewProject: false })}
        >
        <Input
          placeholder="Insert your new project name here"
          value={this.state.newProjectName}
          onChange={(e)=> this.setState({ newProjectName: e.target.value })}
          onPressEnter={this.onAddNewProject}
        />
        </Modal>
        { Object.keys(this.state.projects).length > 0 && this.state.projects[this.state.currentProjectId] && (
          <>
            <Modal
              visible={this.state.deleteProjectModalIsOpen}
              title="Delete a project"
              onCancel={() => this.setState({deleteProjectModalIsOpen: false})}
              footer={[
                <Button key="back" onClick={() => this.setState({deleteProjectModalIsOpen: false})}>
                  Back
                </Button>,
                <Button key="submit" type="primary" danger onClick={this.handleDeleteProject}>
                  Delete my project
                </Button>,
              ]}
            >
              <p>Are you sure you want to delete your project "{this.state.projects[this.state.currentProjectId].name}"? </p>
              <p>Once deleted, it is forever lost...</p>
            </Modal>
            <ExpandableFormModal
            title={`Add a new ${(this.state.candidateNewObject || {}).objectType}`}
              isOpen={this.state.formModalIsOpen}
              onSubmit={this.onSubmitCreateObject}
              onCancel={this.onCancelAddObject}
            />
          </>
        )}
      </>
    )
    if (Object.keys(this.state.projects).length === 0) {
      return (
        <>
          {modals}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Text> Welcome to KeG, a flexible mind map maker inspired by knowledge graphs. </Text>
            <Text> Note that your graph data will be saved in local storage. </Text>
            <div style={{ marginBottom: '0.5em', marginTop: '1em', display: 'flex', flexDirection: 'row', alignItems: 'bottom', justifyContent: 'center' }}>
              <PlusSquareTwoTone style={{ fontSize: '2em'  }} onClick={() => this.setState({ isCreatingNewProject: true })}/>
              <p style={{ marginLeft: '1em' }}> Click here to create a new project to get started </p>
            </div>
          </div>
        </>
      )
    } else {
      const { nodes, edges } = (this.state.projects[this.state.currentProjectId] || { graph: { nodes: [], edges: [] }}).graph;
      const selected = this.state.selected;
      const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;
      return (
        <>
          {modals}
          <div style={{ marginBottom: '0.5em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Select
              style={{ paddingLeft: '1em', width: '15%' }}
              value={this.state.currentProjectId}
              onChange={(projectId) => this.setState({ currentProjectId: projectId, selected: null })}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                    <a
                      style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                      onClick={() => this.setState({ isCreatingNewProject: true })}
                    >
                      <PlusOutlined /> New project
                    </a>
                  </div>
                </div>
              )}
              options={Object.keys(this.state.projects).map((projectId) => ({ label: this.state.projects[projectId].name, value: projectId }))}
            />
            <DeleteOutlined style={{ paddingRight: '1em', fontSize: '1.6em' }} onClick={() => this.setState({ deleteProjectModalIsOpen: true })}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row'}}>
            <div id="graph" style={{ width: '80%', height: '37rem' }}>
                <GraphView
                  ref={el => (this.GraphView = el)}
                  nodeKey={NODE_KEY}
                  nodes={nodes}
                  edges={edges}
                  selected={selected}
                  nodeTypes={NodeTypes}
                  nodeSubtypes={NodeSubtypes}
                  edgeTypes={EdgeTypes}
                  onSelectNode={this.onSelectNode}
                  onCreateNode={this.onCreateNode}
                  onUpdateNode={this.onUpdateNode}
                  onDeleteNode={this.onDeleteNode}
                  onSelectEdge={this.onSelectEdge}
                  onCreateEdge={this.onCreateEdge}
                  disableBackspace
                  onSwapEdge={this.onSwapEdge}
                  onDeleteEdge={this.onDeleteEdge}
                  onUndo={this.onUndo}
                  onCopySelected={this.onCopySelected}
                  onPasteSelected={this.onPasteSelected}
                  layoutEngineType={this.state.layoutEngineType}
                  edgeHandleSize={50}
                  renderNodeText={this.renderNodeText}
                  nodeSize={1000}
                />
            </div>
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <Title level={4} style={{ textAlign: 'center' }}> Controls: </Title>
                <ul>
                  <li> Create node: hold <code>shift</code> and left click at the location of your new node.</li>
                  <li> Create edge: hold <code>shift</code> and drag from the originating node to the destination node to create an edge.</li>
                  <li> Deleting edge or node: Click trash icon on card. </li>
                </ul>
              </div>
              <Divider/>
              { !selected && <p> Click on a node or edge to find out more </p> }
              <div style={{ width: '80%' }}>
                { selected && (
                  <EditableInfoCard
                    title={`Selected ${selected.objectType}`}
                    contents={selected.fields}
                    onEditContents={this.onEditCardContents}
                    onDeleteCard={() => this.onDeleteObject(selected)}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}
