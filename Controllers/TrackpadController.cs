using System;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Web.Http;

namespace Trackpad.Controllers
{
	public class TrackpadMoveRequest
	{
		[Required]
		public string AuthToken { get; set; }

		[Required]
		public int DeltaX { get; set; }

		[Required]
		public int DeltaY { get; set; }
	}
	public class TrackpadClickRequest
	{
		[Required]
		public string AuthToken { get; set; }
	}

	[RoutePrefix("api/Trackpad")]
	public class TrackpadController : ApiController
	{
		[HttpPost]
		[Route("Move")]
		public void MoveMouse(TrackpadMoveRequest moveRequest)
		{
			if (!AuthenticationController.ValidateAuthToken(moveRequest.AuthToken))
			{
				return;
			}

			Point currentLocation = GetCursorPosition();

			int newX = currentLocation.X + moveRequest.DeltaX;
			int newY = currentLocation.Y + moveRequest.DeltaY;

			SetCursorPos(newX, newY);
		}

		[HttpPost]
		[Route("Click")]
		public void Click(TrackpadClickRequest clickRequest)
		{
			if (!AuthenticationController.ValidateAuthToken(clickRequest.AuthToken))
			{
				return;
			}

			MouseEvent(MouseEventFlags.LeftDown | MouseEventFlags.LeftUp);
		}




		/// <summary>
		/// Struct representing a point.
		/// </summary>
		[StructLayout(LayoutKind.Sequential)]
		public struct POINT
		{
			public int X;
			public int Y;

			public static implicit operator Point(POINT point)
			{
				return new Point(point.X, point.Y);
			}
		}

		/// <summary>
		/// Retrieves the cursor's position, in screen coordinates.
		/// </summary>
		/// <see>See MSDN documentation for further information.</see>
		[DllImport("user32.dll")]
		public static extern bool GetCursorPos(out POINT lpPoint);

		public static Point GetCursorPosition()
		{
			POINT lpPoint;
			GetCursorPos(out lpPoint);
			return lpPoint;
		}

		[DllImport("user32.dll")]
		public static extern long SetCursorPos(int x, int y);




		[Flags]
		public enum MouseEventFlags
		{
			LeftDown = 0x00000002,
			LeftUp = 0x00000004,
			MiddleDown = 0x00000020,
			MiddleUp = 0x00000040,
			Move = 0x00000001,
			Absolute = 0x00008000,
			RightDown = 0x00000008,
			RightUp = 0x00000010
		}

		[DllImport("user32.dll")]
		private static extern void mouse_event(int dwFlags, int dx, int dy, int dwData, int dwExtraInfo);

		public static void MouseEvent(MouseEventFlags value)
		{
			Point position = GetCursorPosition();

			mouse_event
				((int)value,
				 position.X,
				 position.Y,
				 0,
				 0);
		}
	}
}