using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using System;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("MySqlDatabase");
    }

    public void TestConnection()
    {
        try
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                Console.WriteLine("Connection successful!");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}