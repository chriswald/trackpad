using System.Windows.Forms;

namespace Trackpad.Forms
{
	public partial class CodeForm : Form
	{
		public CodeForm(string code)
		{
			InitializeComponent();

			lblCode.Text = code;

			lblCode.Left = (this.Width / 2) - (lblCode.Width / 2);
			lblCode.Top = (this.Height / 2) - (lblCode.Height / 2);
		}
	}
}
