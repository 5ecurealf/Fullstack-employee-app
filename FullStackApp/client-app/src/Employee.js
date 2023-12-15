import React, { Component } from "react";
import { variables } from "./Variables";

export class Employee extends Component {
  constructor(props) {
    super(props);

    // populating state varaiable with data from API
    this.state = {
      departments: [],
      employees: [],
      modalTitle: "",
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining: "",
      PhotoFileName: "anonymous.png",
      PhotoPath: variables.PHOTO_URL,
    };
  }

  changeEmployeeName = (e) => {
    this.setState({ EmployeeName: e.target.value });
  };
  changeDepartment = (e) => {
    console.log("changing the Department state to : ", e.target.value);
    this.setState({ Department: e.target.value });
  };
  changeDateOfJoining = (e) => {
    this.setState({ DateOfJoining: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Add Employee",
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining: "",
      PhotoFileName: "anonymous.png",
    });
  }

  editClick(emp) {
    this.setState({
      modalTitle: "Edit Employee",
      EmployeeId: emp.employeeid,
      EmployeeName: emp.employeename,
      Department: emp.department,
      DateOfJoining: emp.dateofjoining,
      PhotoFileName: emp.photofilename,
    });
  }

  createClick() {
    fetch(variables.API_URL + "employee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EmployeeName: this.state.EmployeeName,
        Department: this.state.Department,
        DateOfJoining: this.state.DateOfJoining,
        PhotoFileName: this.state.PhotoFileName,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("failed");
        }
      );
  }
  updateClick() {
    fetch(variables.API_URL + "employee", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EmployeeId: this.state.EmployeeId,
        EmployeeName: this.state.EmployeeName,
        Department: this.state.Department,
        DateOfJoining: this.state.DateOfJoining,
        PhotoFileName: this.state.PhotoFileName,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("failed");
        }
      );
  }
  deleteClick(id) {
    if (window.confirm("Are you sure?")) {
      fetch(variables.API_URL + "employee/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result);
            this.refreshList();
          },
          (error) => {
            alert("failed");
          }
        );
    }
  }

  refreshList() {
    fetch(variables.API_URL + "department")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ departments: data });
      });
    fetch(variables.API_URL + "employee")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ employees: data });
      });
  }

  // call the refresh method once the component is mounted
  componentDidMount() {
    this.refreshList();
  }

  render() {
    const {
      departments,
      employees,
      modalTitle,
      EmployeeId,
      EmployeeName,
      Department,
      DateOfJoining,
      PhotoPath,
      PhotoFileName,
    } = this.state;
    return (
      <div className="container">
        <button
          type="button"
          className="btn btn-primary m-2 float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => this.addClick()}
        >
          Add Employee
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>EmployeeId</th>
              <th>EmployeeName</th>
              <th>Department</th>
              <th>DOJ</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeid}</td>
                <td>{emp.employeename}</td>
                <td>{emp.department}</td>
                <td>{emp.dateofjoining}</td>
                {/* options column */}
                <td>
                  <button
                    type="button"
                    className="btn btn-light mr-1"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.editClick(emp)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="btn btn-light mr-1"
                    onClick={() => this.deleteClick(emp.employeeid)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ---------- Modal ----------*/}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              {/* Modal Body  */}
              <div className="modal-body">
                <div className="d-flex flex-row bd-highlight mb-3">
                  <div className="p-2 w-50 bd-highlight">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Employee Name</span>
                      <input
                        type="text"
                        className="form-control"
                        value={EmployeeName}
                        onChange={this.changeEmployeeName}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text"> Department </span>
                      <select
                        className="form-select"
                        onChange={this.changeDepartment}
                        value={Department}
                      >
                        <option>Please select a department</option>
                        {departments.map((dep) => (
                          <option key={dep.departmentid}>
                            {dep.departmentname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">DOJ</span>
                      <input
                        type="date"
                        className="form-control"
                        value={DateOfJoining}
                        onChange={this.changeDateOfJoining}
                      />
                    </div>
                  </div>
                  {/* Modal Photo */}
                  <div className="p-2 w-50 bd-highlight">
                    <img
                      width="250px"
                      height="250px"
                      src={PhotoPath + PhotoFileName}
                    ></img>
                  </div>
                </div>
                {/* Modal Buttons */}
                {EmployeeId == 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.createClick()}
                  >
                    Create
                  </button>
                ) : null}

                {EmployeeId != 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.updateClick()}
                  >
                    Update
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {/* modal */}
      </div>
    );
  }
}
