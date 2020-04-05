using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Trackpad
{
	public class Program
	{
		public static void Main()
		{
			string baseAddress = "http://localhost:9000/";

			using (WebApp.Start<Startup>(baseAddress))
			{
				Console.WriteLine("Press ENTER to stop the server...");
				Console.Read();
			}
		}
	}
}