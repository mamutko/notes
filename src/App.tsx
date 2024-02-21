import React, { ReactNode, useState } from 'react';
import './App.css';
import WickedNote from './WickedNote';
import InputToggle from './InputToggle';
import PersistentNote, { State as NoteState, createPersistentNote } from './PersistentNote';
//import PersistentNoteGroup, { State as NoteGroupState } from './PersistentNoteGroup';
import PersistentNotebook, { State as NotebookState} from './PersistentNotebook';
import PageOpener from './PageOpener';
import usePersistentState, { wnParse, wnStringify } from './PersistentState';
import Settings, { NOTEBOOK_KEY } from './Settings';
import { HashRouter, Link, Route, Routes, ScrollRestoration, useParams } from 'react-router-dom';

export class NotebookView {
  name: string = "Journal";
  filter: string = "^Week of.*$";
  editable: boolean = false;
}

export class State {
  views: NotebookView[] = [new NotebookView()];
}

function initialState(): State {
  let state = new State();

  state.views.push(new NotebookView());
  state.views[1].name = "Favourites";
  state.views[1].filter = "^#FAV$"

  state.views.push(new NotebookView());
  state.views[2].name = "All";
  state.views[2].filter = ".*"

  return state;
}


function App() {  

  const [state, setState] = usePersistentState("appstate_v2", initialState());

  return (
    <div className="App">
      <HashRouter>
        <div className='app-nav-bar'>
          {
            state.views.map((view, index) => (<>
              <Link to={`/view/${index}`}>{view.name}</Link>
              &nbsp;|&nbsp;
              </>
            ))
          }
          <Link to="/">Home</Link>&nbsp;|&nbsp;
          <Link to="/settings">Settings</Link>
        </div>
        <Routes>
          <Route path="/open" element={<PageOpener/>}/>
          <Route path="/settings" element={<Settings appState={state} setAppState={setState}/>}/>
          <Route path="/view/:viewId" element={
            <NotebookViewComponent state={state}/>
            
          }/>
        </Routes>
      </HashRouter>

    </div>
  );
}

export function NotebookViewComponent(props:any) {
  // TODO: Refactor, move component into separate file. Should it access useParams() here?
  const { viewId } = useParams();

  const viewProps = props.state.views[Number(viewId ?? "0")];

  console.log(`viewId: ${viewId}`)
  
  return             <div>
  <h1>{viewProps.name}</h1>
  <PersistentNotebook filter={viewProps.filter} storageKey={NOTEBOOK_KEY} />
</div>;
}

export default App;
