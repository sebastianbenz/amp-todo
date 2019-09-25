import Head from 'next/head';
import AmpState from '../components/AmpState';

export const config = { amp: true };

const Index = () => (
  <div>
      <style global jsx>{`
        * {
          box-sizing: border-box;
        }
        body {
          background: #eee;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-size: 1.5rem;
        }
        header {
          text-align: center;
        }
        header h1 {
          font-weight: 400;
        }
        main, header {
          max-width: 700px;
          margin: 1rem auto;
          border-radius: 0.25rem;
        }
        main {
          background: #fff;
          display: flex;
          flex-direction: column;
          box-shadow: 0 15px 35px -5px rgba(0,0,0,.25);
        }
        #todo-input, .todo {
          min-width: 300px;
          max-width: 700px;
          width: 100%;
        }
        #todo-input {
          padding: 1rem;
          font-size: 1.5rem;
          -webkit-appearance: none;
          border-radius: 0.5rem;
          border: none;
        }
        .todo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;
          padding: 0.5rem 1rem;
          background: #fff;
          border-top: solid #ccc 1px;
        }
        .todo.done > input {
          height: 2rem;
        }
        .todo.done > label {
          text-decoration:  line-through;
        }
        .todo > * {
          padding: 0.5rem;
        }
        .todo > input {
          transform: scale(1.5);
        }
        .todo > label {
          display: block;
          width: 100%;
        }
        .todo.done > label {
          color: #999;
        }
        .todo .todo-delete {
          align-self: flex-end;
        }
        .todo-filter {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem;
        }
        .todo-filter [option] {
          color: #aaa;
          padding: 0 0.5rem;
          font-width: 400;
          font-size: 1rem;
          text-transform: uppercase;
        }
        .todo-filter [option][selected] {
          outline-color: #aaa;
        }
      `}</style>
      <Head>
        <script
          async
          key="amp-bind"
          custom-element="amp-bind"
          src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
        />
        <script
          async
          key="amp-selector"
          custom-element="amp-selector"
          src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"
        />
        <script
          async
          key="amp-form"
          custom-element="amp-form"
          src="https://cdn.ampproject.org/v0/amp-form-0.1.js"
        />
        <script
          async
          key="amp-list"
          custom-element="amp-list"
          src="https://cdn.ampproject.org/v0/amp-list-0.1.js"
        />
        <script
          async
          key="amp-mustache"
          custom-template="amp-mustache"
          src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"
        />
      </Head>
      <header>
        <h1>TODOS</h1>
      </header>
      <main>
      <AmpState id="todos" value={ [] } />
      <AmpState id="filter" value={ "all" } />
      <AmpState id="lastId" value={ 0 } />

      <amp-bind-macro id="createTodo" arguments="todos, text" expression="{
            id: todos.length,
            text: text,
            done: false
          }"></amp-bind-macro>
      <amp-bind-macro id="reindexTodos" arguments="todos" expression="
          todos.map((todo, i) => {
            id: i,
            text: todo.text,
            done: todo.done
          })"></amp-bind-macro>
      <amp-bind-macro id="toggleTodo" arguments="todos, index, done" expression="
          todos.splice(index, 1, {
            id: index,
            done: done
          })
      "></amp-bind-macro>
      <amp-bind-macro id="deleteTodo" arguments="todos, id" expression="
          reindexTodos(todos.filter(todo => todo.id != id))
      "></amp-bind-macro>
      <amp-bind-macro id="filterTodos" arguments="todos, filter" expression="
          todos.filter(todo => (filter == 'complete' ? todo.done : filter == 'active' ? !todo.done : true))
      "></amp-bind-macro>
      <amp-bind-macro id="addTodo" arguments="todos, text" expression="
          reindexTodos(todos.concat([createTodo(todos, text)]))
      "></amp-bind-macro>

        <form id="todo-form" method="post" action-xhr="/">
        <input id="todo-input" name="todo" autofocus="true" autocomplete="off" 
          type="text" on="change:AMP.setState({
            lastId: lastId + 1,
            todos: addTodo(todos, event.value)
          }),todo-form.clear"
          data-amp-bind-value="input"
          placeholder="What needs to be done?"></input>
          </form>
        <amp-list src="https://example.com" 
          data-amp-bind-src="todos" 
          data-amp-bind-is-layout-container="todos" 
          items="todos"
          width="0" 
          height="0">
            <template type="amp-mustache">
              <div className="todo {{#done}}`}done{`{{/done}}" 
                data-amp-bind-class="todos[{{id}}].done ? 'todo done' : 'todo'"
                data-amp-bind-hidden="filter == 'complete' ? !todos[{{id}}].done : filter == 'active' ? todos[{{id}}].done : false">
                <input type="checkbox" 
                  data-amp-bind-checked="todos[{{id}}].done"
                  on="change:AMP.setState({
                    todos: toggleTodo(todos, {{id}}, event.checked)
                  })"></input>
                <label for="todo-{{id}}">{`{{text}}`}</label>
                <div className="todo-delete" tabindex="0" role="button" on="tap:AMP.setState({
                  todos: deleteTodo(todos, {{id}})
                })">X</div>
              </div>
            </template>
          </amp-list>
          <amp-selector className="todo-filter" 
              hidden="" 
              data-amp-bind-hidden="todos.length == 0"
              on="select:AMP.setState({
                filter: event.targetOption
              })">
            <div option="all" selected>all</div>
            <div option="active">active</div>
            <div option="complete">complete</div>
          </amp-selector>
      </main>
  </div>
);

export default Index;
