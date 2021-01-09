// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*
  Example usage of GraphView component
*/

import * as React from 'react';
import { Divider, Typography } from 'antd';
import EditableInfoCard from './EditableInfoCard';
import ExpandableFormModal from './ExpandableFormModal';

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
} from './graph-config'; // Configures node/edge types


const { Title } = Typography;

// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.
const sample = {
  edges: [
    {
      handleText: '5',
      handleTooltipText: '5',
      source: 'start1',
      target: 'a1',
      type: SPECIAL_EDGE_TYPE,
    },
    {
      handleText: '5',
      handleTooltipText: 'This edge connects Node A and Node B',
      source: 'a1',
      target: 'a2',
      type: SPECIAL_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a2',
      target: 'a4',
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a1',
      target: 'a3',
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a3',
      target: 'a4',
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a1',
      target: 'a5',
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a4',
      target: 'a1',
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: '54',
      source: 'a1',
      target: 'a6',
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: '24',
      source: 'a1',
      target: 'a7',
      type: EMPTY_EDGE_TYPE,
    },
  ],
  nodes: [
    {
      id: 'start1',
      title: 'Start (0)',
      type: SPECIAL_TYPE,
    },
    {
      id: 'a1',
      title: 'Node A (1)',
      type: SPECIAL_TYPE,
      x: 258.3976135253906,
      y: 331.9783248901367,
    },
    {
      id: 'a2',
      subtype: SPECIAL_CHILD_SUBTYPE,
      title: 'Node B (2)',
      type: EMPTY_TYPE,
      x: 593.9393920898438,
      y: 260.6060791015625,
    },
    {
      id: 'a3',
      title: 'Node C (3)',
      type: EMPTY_TYPE,
      x: 237.5757598876953,
      y: 61.81818389892578,
    },
    {
      id: 'a4',
      title: 'Node D (4)',
      type: EMPTY_TYPE,
      x: 600.5757598876953,
      y: 600.81818389892578,
    },
    {
      id: 'a5',
      title: 'Node E (5)',
      type: null,
      x: 50.5757598876953,
      y: 500.81818389892578,
    },
    {
      id: 'a6',
      title: 'Node E (6)',
      type: SKINNY_TYPE,
      x: 300,
      y: 600,
    },
    {
      id: 'a7',
      title: 'Node F (7)',
      type: POLY_TYPE,
      x: 0,
      y: 300,
    },
    {
      id: 'a8',
      title: 'Node G (8)',
      type: COMPLEX_CIRCLE_TYPE,
      x: -200,
      y: 400,
    },
  ],
};

// TODO: do we even need this?



class Graph extends React.Component {

  constructor(props) {
    super(props);
    const graphUsed = JSON.parse(localStorage.graph || 'null') || sample
    console.log("GRAPH USED", graphUsed)

    this.state = {
      copiedNode: null,
      graph: graphUsed,
      layoutEngineType: undefined,
      selected: null,
      totalNodes: graphUsed.nodes.length,
    };

    this.GraphView = React.createRef();
  }

  // Helper to find the index of a given node
  getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex(node => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge: IEdge) {
    return this.state.graph.edges.findIndex(edge => {
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

    return this.state.graph.nodes[i];
  }


  addStartNode = () => {
    const graph = this.state.graph;

    // using a new array like this creates a new memory reference
    // this will force a re-render
    graph.nodes = [
      {
        id: Date.now(),
        title: 'Node A',
        type: SPECIAL_TYPE,
        x: 0,
        y: 0,
      },
      ...this.state.graph.nodes,
    ];
    console.log("SETTING STATE...")
    this.setState({
      graph,
    });
    console.log("OK...")
  };
  deleteStartNode = () => {
    const graph = this.state.graph;

    graph.nodes.splice(0, 1);
    // using a new array like this creates a new memory reference
    // this will force a re-render
    graph.nodes = [...this.state.graph.nodes];
    this.setState({
      graph,
    });
  };

  /*
   * Handlers/Interaction
   */

  saveLocalStorage = () => {
    localStorage.graph = JSON.stringify(this.state.graph)
  }

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = (viewNode: INode) => {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState({ graph });
    this.saveLocalStorage()
  };

  // Node 'mouseUp' handler
  onSelectNode = (viewNode: INode | null) => {
    // Deselect events will send Null viewNode
    this.setState({ selected: viewNode });
  };

  // Edge 'mouseUp' handler
  onSelectEdge = (viewEdge: IEdge) => {
    this.setState({ selected: viewEdge });
  };

  // Updates the graph with a new node
  onCreateNode = (x: number, y: number, mouseEvt) => {
    console.log("ON CREATE NODE CALLEd", x, y, mouseEvt)
    this.setState({
      nodeModalIsOpen: true,
      newNode: {x, y, name: ''}
    })

  };

  onSubmitCreateNode = (fields) => {
    console.log("SUBMITTED:", fields)
    //const type = Math.random() < 0.25 ? SPECIAL_TYPE : EMPTY_TYPE;
    const type = EMPTY_TYPE;
    const { x, y } = this.state.newNode || {};
    const graph = this.state.graph;
    if (!x || ! y)  {
      console.log("NEWNODE is bad", this.state.newNode)
      return

    }
    const node = {
      id: Date.now(),
      title: fields.title,
      fields, 
      type,
      x,
      y,
    };

    graph.nodes = [...graph.nodes, node];
    this.setState({ graph, nodeModalIsOpen: false });
    this.saveLocalStorage()
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
  onDeleteNode = (viewNode: INode, nodeId: string, nodeArr: INode[]) => {
    const graph = this.state.graph;
    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => {
      return (
        edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY]
      );
    });

    graph.nodes = nodeArr;
    graph.edges = newEdges;

    this.setState({ graph, selected: null });
    this.saveLocalStorage()
  };

  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
    const graph = this.state.graph;
    // This is just an example - any sort of logic
    // could be used here to determine edge type
    /*
    const type =
      sourceViewNode.type === SPECIAL_TYPE
        ? SPECIAL_EDGE_TYPE
        : EMPTY_EDGE_TYPE;

    */
    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
//type: EMPTY_EDGE_TYPE,
      handleText: 'Infl'
    };

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      graph.edges = [...graph.edges, viewEdge];
      this.setState({
        graph,
        selected: viewEdge,
      });
      this.saveLocalStorage()
    }
  };

  // Called when an edge is reattached to a different target.
  onSwapEdge = (
    sourceViewNode: INode,
    targetViewNode: INode,
    viewEdge: IEdge
  ) => {
    const graph = this.state.graph;
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
  onDeleteEdge = (viewEdge: IEdge, edges: IEdge[]) => {
    const graph = this.state.graph;

    graph.edges = edges;
    this.setState({
      graph,
      selected: null,
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
    const graph = this.state.graph;

    const newNode = {
      ...node,
      id: Date.now(),
      x: mousePosition ? mousePosition[0] : node.x,
      y: mousePosition ? mousePosition[1] : node.y,
    };

    graph.nodes = [...graph.nodes, newNode];
    this.forceUpdate();
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
    console.log("DATA", data, "ID", id)
    return (
      <text x='0' y='0'> {data.title} </text>
    )
  }
  /*
   * Render
   */

   onEditCardContents = (editedFields) => {
   console.log("EDDD", editedFields)
     this.setState(prevState => ({
       selected: {
         ...prevState.selected,
         fields: {
           ...prevState.selected.fields,
           ...editedFields
         }
       }
     }), () => {
       this.onUpdateNode(this.state.selected)
     })
   }

  render() {
    const { nodes, edges } = this.state.graph;
    const selected = this.state.selected;
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;
    console.log("SELECTED:", selected)
    /*
    * TODO: old shit
          <label>
            Name: <input type="textarea" value={this.state.newNode ? this.state.newNode.name: ''} onChange={(e)=> this.onNewNodeChange({name: e.target.value})} />
          </label>
     */

    return (
      <>
        <ExpandableFormModal
          title="Add a new node"
          isOpen={this.state.nodeModalIsOpen}
          onSubmit={this.onSubmitCreateNode}
          onCancel={() => this.setState({nodeModalIsOpen: false})}
        />
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <div id="graph" style={{ width: '80%', height: /*'calc(100% - 87px)'*/ '37rem'}}>
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
              disableBackspace={true} 
              onSelectEdge={this.onSelectEdge}
              onCreateEdge={this.onCreateEdge}
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <Title level={4}> Controls: </Title>
              <ul>
                <li> Create node: hold <code>shift</code> and left click at the location of your new node.</li>
                <li> Create edge: hold <code>shift</code> and drag from the originating node to the destination node to create an edge</li>
                <li> Deleting edge or node: simply press <code>delete</code> </li>
              </ul>
            </div>
            <Divider/>
            { !selected && <p> Click on a node or edge to find out more </p> }
            <div style={{ width: '80%' }}>
              { selected && (
                <EditableInfoCard
                  title={'Selected Node'}
                  contents={selected.fields}
                  onEditContents={this.onEditCardContents}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Graph;