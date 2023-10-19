using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRChatAppDemo.Host.Dtos;
using SignalRChatAppDemo.Host.HubConfig;

namespace SignalRChatAppDemo.Host.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ChatsController : ControllerBase
    { 
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatsController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;

        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatDto chatDto)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", chatDto.user , chatDto.message);
            return Ok();
        }

    }
}
