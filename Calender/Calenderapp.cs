using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using Calender;
/// @author konst
/// @version 03.10.2024
/// <summary>
/// 
/// </summary>
public class Calenderapp
{
    /// <summary>
    /// A very minimalistic calender app, 
    /// </summary>
   
    private static string directoryPath = AppDomain.CurrentDomain.BaseDirectory; // Or any other directory path
    const string fileName = "Notes.txt";
    private static string PATHTONOTES = Path.Combine(directoryPath, fileName);
    public static void Main()
    {
            if (!File.Exists(PATHTONOTES))
            {
                using (FileStream fs = File.Create(PATHTONOTES)) { }
            }

            if (new FileInfo(PATHTONOTES).Length == 0)
            {
                Console.WriteLine("Calendar empty, want to make a notification?");
                userAction();
            }
            
        else
        {
             string[] display  = File.ReadAllLines(PATHTONOTES);
             CheckNotes(display);
             display = File.ReadAllLines(PATHTONOTES);
             Console.WriteLine("You have the following events coming up:");
             foreach (string line in display)
             {
                 Console.WriteLine(line);
             }
             userAction();
             
        }
    }

    public static void userAction()
    {
        switch (Console.ReadLine())
        {
            case "n":
                Console.Clear();
                makeNotification();
                break;
            case "new":
                Console.Clear();
                makeNotification();
                break;
            case "del":
                Console.Clear();
                deleteNote();
                break;
            case "d":
                Console.Clear();
                deleteNote();
                break;
            default:
                Environment.Exit(0);
                break;
        }
    }
    
    public static void makeNotification()
    {
        notification notification = new notification();
        Console.WriteLine("Please enter the content of the notification:");
        string  contents = Console.ReadLine();
        Console.WriteLine("Please enter the date of the notification:");
        string date = Console.ReadLine();
        notification.makeNote(contents, date);
        notification.saveNote();
        Console.Clear();
        Console.WriteLine("Note created, create another?");
        userAction();
    }

    public static void CheckNotes(string[] display)
    {
        string help = DateTime.Today.ToString("dd/MM/yyyy");
        string[] pvm = help.Split('.');
        List<string> n = new List<string>();
        for (int i = 0; i < display.Length; i++)
        {
            string[] temp = display[i].Split(' ');
            string[] temp2 = temp[0].Split('.');
            if (int.Parse(temp2[1]) == int.Parse(pvm[1]))
            {
                if (int.Parse(temp2[0]) > int.Parse(pvm[0]))
                {
                    n.Add(display[i]);
                }
            }
            if (int.Parse(temp2[1]) > int.Parse(pvm[1]))
            {
                n.Add(display[i]);
            }
        }
        
        File.WriteAllLines(PATHTONOTES, n);
    }

    public static void deleteNote()
    {
        Console.Write("Enter the date of the note to be deleted: ");
        string date = Console.ReadLine().Trim();
        Console.WriteLine();
        string[] notes = File.ReadAllLines(PATHTONOTES);
        List<string> newNotes = new List<string>();
        for (int i = 0; i < notes.Length; i++)
        {
            string[] hlpr = notes[i].Split(' ');
            if (hlpr[0] != date)
            {
                newNotes.Add(notes[i]);
            }
        }
        File.WriteAllLines(PATHTONOTES, newNotes);
        string[] display = File.ReadAllLines(PATHTONOTES);
        Console.WriteLine("You have the following events coming up:");
        foreach (string line in display)
        {
            Console.WriteLine(line);
        }

        System.Console.WriteLine("Press any key to exit");
        Console.ReadKey();
        Environment.Exit(0);
    }
    
}