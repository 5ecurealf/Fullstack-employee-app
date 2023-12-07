using System;
using System.Collections.Generic;
using System.Data;
using Npgsql;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using FullStackApp.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FullStackApp.Controllers
{
    [Route("api/[controller]")]
    public class DepartmentController : Controller
    {

        private readonly IConfiguration _configuration;

        public DepartmentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/values
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"select DepartmentId, DepartmentName from
                             Department";

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
        public JsonResult Post([FromBody] Department dep)
        {
            string query = "INSERT INTO Department (DepartmentName) VALUES (@DepartmentName);";

            DataTable table = new DataTable();

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (NpgsqlConnection myCon = new NpgsqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                {
                    // Check if dep.DepartmentName is not null
                    if (dep.DepartmentName == null)
                    {
                        // Handle the null case appropriately, e.g., skip the insert or insert with a DBNull value
                        myCommand.Parameters.AddWithValue("@DepartmentName", DBNull.Value);
                    }
                    else
                    {
                        myCommand.Parameters.AddWithValue("@DepartmentName", dep.DepartmentName);
                    }

                    // ExecuteReader is typically used for commands that return data (SELECT)
                    // For INSERT, UPDATE, DELETE use ExecuteNonQuery, which returns the number of rows affected
                    int numberOfRowsInserted = myCommand.ExecuteNonQuery();

                    // You can return the number of affected rows, or simply return an OK status, etc.
                    // Since this is an INSERT command, there isn't a DataTable to load and return
                }
                myCon.Close();
            }
            // Return the result as needed, e.g., a success message or the affected row count
            return new JsonResult("Insert successful");
        }



    }
}

