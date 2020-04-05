using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Trackpad
{
	public class Startup
	{
		public void Configuration(IAppBuilder appBuilder)
		{
			string root = AppDomain.CurrentDomain.BaseDirectory;
			PhysicalFileSystem physicalFileSystem = new PhysicalFileSystem(root);

			FileServerOptions fileServerOptions = new FileServerOptions()
			{
				RequestPath = PathString.Empty,
				EnableDefaultFiles = true,
				FileSystem = physicalFileSystem,
				EnableDirectoryBrowsing = false
			};

			HttpConfiguration config = new HttpConfiguration();
			WebApiConfig.Register(config);
			appBuilder.UseWebApi(config);
			appBuilder.UseFileServer(fileServerOptions);
		}
	}
}