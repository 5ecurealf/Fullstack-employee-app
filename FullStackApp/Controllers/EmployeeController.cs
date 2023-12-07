using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Threading.Tasks;
using FullStackApp.Models;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FullStackApp.Controllers
{
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {

        private readonly IConfiguration _configuration;

        public EmployeeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/values
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"SELECT EmployeeId, EmployeeName, Department, DateOfJoining, PhotoFileName from
                             Employee";

            DataTable table = new DataTable();

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");
            NpgsqlDataReader myReader;

            using (NpgsqlConnection myCon = new NpgsqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
                myCon.Close();
            }
            return new JsonResult(table);
        }

        // POST api/values
        [HttpPost]
        public JsonResult Post([FromBody] Employee emp)
        {
            string query = "INSERT INTO Employee (EmployeeName, Department, DateOfJoining, PhotoFileName) VALUES (@EmployeeName, @Department, @DateOfJoining, @PhotoFileName);";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (NpgsqlConnection myCon = new NpgsqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@EmployeeName", emp.EmployeeName);
                    myCommand.Parameters.AddWithValue("@Department", emp.Department);

                    // Parse the DateOfJoining string to a DateTime object
                    DateTime dateOfJoining;
                    if (DateTime.TryParse(emp.DateOfJoining, out dateOfJoining))
                    {
                        myCommand.Parameters.AddWithValue("@DateOfJoining", dateOfJoining);
                    }
                    else
                    {
                        // Handle the case where the date parsing fails
                        return new JsonResult("Invalid DateOfJoining format");
                    }

                    myCommand.Parameters.AddWithValue("@PhotoFileName", emp.PhotoFileName);

                    int numberOfRowsInserted = myCommand.ExecuteNonQuery();
                }
                myCon.Close();
            }
            return new JsonResult("Insert successful");
        }


        // PUT api/values/5
        [HttpPut]
        public ActionResult Put([FromBody] Employee emp)
        {
            string query = "UPDATE Employee SET EmployeeName = @EmployeeName, Department= @Department, DateOfJoining = @DateOfJoining, PhotoFileName = @PhotoFileName WHERE EmployeeId = @EmployeeId;";

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (NpgsqlConnection myCon = new NpgsqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@EmployeeId", emp.EmployeeId);
                    myCommand.Parameters.AddWithValue("@EmployeeName", emp.EmployeeName);
                    myCommand.Parameters.AddWithValue("@Department", emp.Department);
                    myCommand.Parameters.AddWithValue("@DataOfJoining", emp.DateOfJoining);
                    myCommand.Parameters.AddWithValue("@PhotoFileName", emp.PhotoFileName);

                    int numberOfRowsUpdated = myCommand.ExecuteNonQuery();
                }
                myCon.Close();
            }
            return Ok("Successfully Updated Database");
        }


        // DELETE api/values/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            string query = "DELETE FROM Employee WHERE EmployeeId = @EmployeeId;";

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");
            int numberOfRowsDeleted;

            using (NpgsqlConnection myCon = new NpgsqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@EmployeeId", id);
                    numberOfRowsDeleted = myCommand.ExecuteNonQuery();
                }
                myCon.Close();
            }
            return Ok("Successfully Deleted from Database");
        }

    }
}

