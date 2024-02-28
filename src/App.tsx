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
import { HashRouter, Link, NavLink, Route, Routes, ScrollRestoration, useParams } from 'react-router-dom';
import { useScrollRestoration } from 'use-scroll-restoration';

export class NotebookView {
  name: string = "Journal";
  filter: string = "^Week of.*$";
  editable: boolean = false;
  popup: boolean = false;
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

  function navlinkClass(props: any)
  {
    const {isActive} = props;
    return isActive ? 'app-nav-bar-element app-nav-bar-link app-nav-bar-active-link' : 'app-nav-bar-element app-nav-bar-link';
  }

  return (
    <div className="App">
      <HashRouter>
        <div className='app-nav-bar' >
          {
            state.views.map((view, index) => (<NavLink className={navlinkClass} to={`/view/${index}`}>{view.name}</NavLink>))
          }
          <div className='app-nav-bar-element' style={{flexGrow:100}}></div>
          <NavLink className={navlinkClass}  to="/">&#x2302;</NavLink>
          <NavLink className={navlinkClass}  to="/settings">&#x2699;</NavLink>
        </div>
        <div className='app-content'>
          <Routes>
            <Route path="/open" element={<PageOpener/>}/>
            <Route path="/settings" element={<Settings appState={state} setAppState={setState}/>}/>
            <Route path="/view/:viewId" element={
              <NotebookViewComponent state={state}/>
              
            }/>
          </Routes>
        </div>
      </HashRouter>

    </div>
  );
}

export function NotebookViewComponent(props:any) {
  // TODO: Refactor, move component into separate file. Should it access useParams() here?
  const { viewId } = useParams();

  // TODO: review scroll key format. It's tied to view index.
  const {ref, setScroll} = useScrollRestoration(`nv_scroll_context_v1_${viewId ?? "0"}`, {debounceTime:200, persist:'localStorage'});

  const viewProps = props.state.views[Number(viewId ?? "0")];

  console.log(`viewId: ${viewId}`)
  
  return             <div ref={ref} style={{height: "100%", overflow: 'auto'}}>
  <h1>{viewProps.name}</h1>
  <PersistentNotebook filter={viewProps.filter} storageKey={NOTEBOOK_KEY} />
</div>;
}

export default App;
