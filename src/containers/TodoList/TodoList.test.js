import React from 'react';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import TodoList from '../TodoList/TodoList';
import * as actionCreators from '../../store/actions/todo';
import { mount } from 'enzyme';
jest.mock('../../components/Todo/Todo', () => {
  return jest.fn((props) => {
    return (
      <div calssName='spyTodo'>
        <div className='title' onClcik={props.clickDetail}>
          {props.title}
        </div>
        <button className='doneButton' onClick={props.clickDone} />
        <button className='deleteButton' onClick={props.clickDelete} />
      </div>
    );
  });
});

const stubInitialState = {
  todos: [
    { id: 1, title: 'TODO_TEST_TITLE_1', done: false },
    { id: 2, title: 'TODO_TEST_TITLE_2', done: false },
    { id: 3, title: 'TODO_TEST_TITLE_3', done: false },
  ],
  selectedTodo: null,
};

const mockStore = getMockStore(stubInitialState);
describe('<TodoList />', () => {
  let todoList, spyGetTodos;
  beforeEach(() => {
    todoList = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path='/'
              exact
              render={() => <TodoList title='TODOLIST_TEST_TITLE' />}
            />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyGetTodos = jest
      .spyOn(actionCreators, 'getTodos')
      .mockImplementation(() => {
        return (dispatch) => {};
      });
  });

  it('should render Todos', () => {
    const component = mount(todoList);
    const wrapper = component.find('.spyTodo');

    expect(wrapper.length).toBe(3);
    // initial State 3 items
    expect(wrapper.at(0).text()).toBe('TODO_TEST_TITLE_1');
    expect(wrapper.at(1).text()).toBe('TODO_TEST_TITLE_2');
    expect(wrapper.at(2).text()).toBe('TODO_TEST_TITLE_3');
    expect(spyGetTodos).toBeCalledTimes(1);
  });
});
