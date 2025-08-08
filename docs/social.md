/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

# Social Components Documentation

## Overview

This documentation outlines the real-time social components system for the Twisted Artists Guild platform, including the frontend prototype implementation and the backend requirements for full functionality.

## Architecture

### Frontend Components

1. **SocialRealtimeContext** - WebSocket/SSE management and real-time state
2. **SocialComments** - Threaded comment system with real-time updates
3. **DirectMessages** - Real-time messaging with typing indicators
4. **SocialReactions** - Real-time emoji reactions system
5. **WysiwygSingleLine** - Rich text editor for short content
6. **WysiwygTextArea** - Rich text editor for longer content

### Backend Requirements

## Database Schema

### Comments Table
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    context_id VARCHAR(255) NOT NULL, -- ID of the content being commented on (artwork, post, etc.)
    context_type VARCHAR(50) NOT NULL, -- Type of content (artwork, blog_post, etc.)
    parent_id INTEGER REFERENCES comments(id), -- For replies/threaded comments
    likes_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_context ON comments(context_id, context_type);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_author ON comments(author_id);
```

### Reactions Table
```sql
CREATE TABLE reactions (
    id SERIAL PRIMARY KEY,
    target_id VARCHAR(255) NOT NULL, -- ID of the content being reacted to
    target_type VARCHAR(50) NOT NULL, -- Type: 'post', 'comment', 'message', etc.
    emoji VARCHAR(10) NOT NULL, -- Unicode emoji
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(target_id, target_type, emoji, user_id) -- Prevent duplicate reactions
);

CREATE INDEX idx_reactions_target ON reactions(target_id, target_type);
CREATE INDEX idx_reactions_user ON reactions(user_id);
```

### Messages Table
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file', etc.
    status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read'
    reply_to_id INTEGER REFERENCES messages(id), -- For message replies
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### Conversations Table
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255), -- NULL for direct conversations, named for group chats
    conversation_type VARCHAR(20) DEFAULT 'direct', -- 'direct', 'group'
    last_message_id INTEGER REFERENCES messages(id),
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Conversation Participants Table
```sql
CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member', -- 'member', 'admin', 'owner'
    unread_count INTEGER DEFAULT 0,
    last_read_at TIMESTAMP,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
```

### Comment Likes Table
```sql
CREATE TABLE comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL REFERENCES comments(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);
```

### User Presence Table
```sql
CREATE TABLE user_presence (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Comments API
```
GET    /api/comments?context_id={id}&context_type={type}     - Get comments for content
POST   /api/comments                                        - Create new comment
PUT    /api/comments/{id}                                   - Update comment
DELETE /api/comments/{id}                                   - Delete comment
POST   /api/comments/{id}/like                              - Like/unlike comment
```

### Reactions API
```
GET    /api/reactions?target_id={id}&target_type={type}     - Get reactions for content
POST   /api/reactions                                       - Add reaction
DELETE /api/reactions/{id}                                  - Remove reaction
```

### Messages API
```
GET    /api/conversations                                   - Get user's conversations
GET    /api/conversations/{id}/messages                     - Get conversation messages
POST   /api/conversations/{id}/messages                     - Send message
PUT    /api/messages/{id}                                   - Edit message
DELETE /api/messages/{id}                                   - Delete message
POST   /api/messages/{id}/read                              - Mark message as read
```

### Real-time WebSocket Events

#### Incoming Events (Client -> Server)
```javascript
// Join specific channels for real-time updates
{
    type: 'join_channel',
    data: {
        channel: 'comments:artwork:123', // or 'conversation:456', 'reactions:post:789'
    }
}

// Leave channels
{
    type: 'leave_channel',
    data: {
        channel: 'comments:artwork:123'
    }
}

// Typing indicator
{
    type: 'typing',
    data: {
        conversation_id: 'conv-123',
        is_typing: true
    }
}
```

#### Outgoing Events (Server -> Client)
```javascript
// New comment added
{
    type: 'comment_added',
    data: {
        id: 'comment-123',
        content: '<p>Great artwork!</p>',
        author_id: 'user-456',
        author: 'username',
        author_display_name: 'Display Name',
        avatar_url: 'https://...',
        context_id: 'artwork-789',
        context_type: 'artwork',
        created_at: '2025-08-07T12:00:00Z'
    }
}

// New reaction added
{
    type: 'reaction_added',
    data: {
        target_id: 'post-123',
        target_type: 'post',
        emoji: '❤️',
        user_id: 'user-456',
        username: 'username'
    }
}

// New message received
{
    type: 'message_received',
    data: {
        id: 'msg-123',
        content: 'Hello there!',
        sender_id: 'user-456',
        sender_name: 'Username',
        conversation_id: 'conv-789',
        created_at: '2025-08-07T12:00:00Z'
    }
}

// User typing indicator
{
    type: 'user_typing',
    data: {
        user_id: 'user-456',
        username: 'Username',
        conversation_id: 'conv-789',
        is_typing: true
    }
}

// User presence update
{
    type: 'presence_update',
    data: {
        user_id: 'user-456',
        is_online: true,
        last_seen: '2025-08-07T12:00:00Z'
    }
}
```

## ASP.NET Core Implementation

### Controllers

#### CommentsController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;
    private readonly IHubContext<SocialHub> _hubContext;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(
        string contextId, 
        string contextType, 
        int page = 1, 
        int pageSize = 20)
    {
        // Implement pagination and filtering
    }

    [HttpPost]
    public async Task<ActionResult<CommentDto>> CreateComment(CreateCommentDto dto)
    {
        var comment = await _commentService.CreateCommentAsync(dto);
        
        // Send real-time update
        await _hubContext.Clients.Group($"comments:{dto.ContextType}:{dto.ContextId}")
            .SendAsync("comment_added", comment);
            
        return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
    }
}
```

#### MessagesController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IHubContext<SocialHub> _hubContext;

    [HttpPost("conversations/{conversationId}/messages")]
    public async Task<ActionResult<MessageDto>> SendMessage(
        int conversationId, 
        SendMessageDto dto)
    {
        var message = await _messageService.SendMessageAsync(conversationId, dto);
        
        // Send real-time update to conversation participants
        await _hubContext.Clients.Group($"conversation:{conversationId}")
            .SendAsync("message_received", message);
            
        return Ok(message);
    }
}
```

### SignalR Hub
```csharp
public class SocialHub : Hub
{
    public async Task JoinChannel(string channel)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, channel);
    }

    public async Task LeaveChannel(string channel)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channel);
    }

    public async Task SendTypingIndicator(string conversationId, bool isTyping)
    {
        await Clients.GroupExcept($"conversation:{conversationId}", Context.ConnectionId)
            .SendAsync("user_typing", new { 
                UserId = Context.UserIdentifier, 
                IsTyping = isTyping 
            });
    }

    public override async Task OnConnectedAsync()
    {
        // Update user presence
        await UpdateUserPresence(Context.UserIdentifier, true);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        // Update user presence
        await UpdateUserPresence(Context.UserIdentifier, false);
        await base.OnDisconnectedAsync(exception);
    }
}
```

## Frontend Integration

### Using the Components
```javascript
import { SocialRealtimeProvider } from '@/components/social/SocialRealtimeContext';
import SocialComments from '@/components/social/Comments';
import DirectMessages from '@/components/social/DirectMessages';
import SocialReactions from '@/components/social/Reactions';

function ArtworkPage({ artwork, currentUser }) {
    return (
        <SocialRealtimeProvider>
            <div className="artwork-container">
                {/* Artwork Display */}
                <div className="artwork-image">
                    <img src={artwork.imageUrl} alt={artwork.title} />
                </div>
                
                {/* Reactions */}
                <SocialReactions
                    targetId={artwork.id}
                    targetType="artwork"
                    initialReactions={artwork.reactions}
                    currentUser={currentUser}
                    onReactionAdd={handleReactionAdd}
                    onReactionRemove={handleReactionRemove}
                />
                
                {/* Comments */}
                <SocialComments
                    contextId={artwork.id}
                    contextType="artwork"
                    initialComments={artwork.comments}
                    currentUser={currentUser}
                    onAddComment={handleAddComment}
                    onUpdateComment={handleUpdateComment}
                    onLikeComment={handleLikeComment}
                />
            </div>
        </SocialRealtimeProvider>
    );
}
```

## Environment Variables

```bash
# WebSocket Configuration
WEBSOCKET_URL=wss://your-api.com/hub/social
WEBSOCKET_RECONNECT_ATTEMPTS=5
WEBSOCKET_RECONNECT_DELAY=1000

# API Configuration
API_BASE_URL=https://your-api.com/api
API_TIMEOUT=30000

# Real-time Features
ENABLE_REAL_TIME=true
ENABLE_TYPING_INDICATORS=true
ENABLE_PRESENCE_TRACKING=true
```

## Deployment Considerations

### Frontend
- Ensure WebSocket connections are properly handled in production
- Implement connection retry logic with exponential backoff
- Add error boundaries around social components
- Consider implementing service workers for offline message queuing

### Backend
- Configure SignalR for scale-out with Redis backplane
- Implement rate limiting for WebSocket events
- Set up proper CORS policies for WebSocket connections
- Monitor WebSocket connection counts and performance

### Database
- Add proper indexes for performance
- Consider implementing soft deletes for content moderation
- Set up database connection pooling
- Implement caching for frequently accessed data (reactions, user presence)

## Security Considerations

- Validate all real-time events on the server side
- Implement proper authentication for WebSocket connections
- Sanitize all user content before storage and display
- Implement rate limiting for comments, messages, and reactions
- Add content moderation hooks for inappropriate content detection

## Performance Optimizations

- Implement message pagination for large conversations
- Use virtual scrolling for long comment threads
- Debounce typing indicators to reduce WebSocket traffic
- Cache user presence data with reasonable TTL
- Implement lazy loading for reaction counts and details

## Implementation Status

### ✅ Completed Features
- Real-time comment system with threading
- Interactive emoji reactions (10 reaction types)
- Direct messaging with typing indicators
- User presence tracking
- Mock WebSocket service for development
- Responsive design with DaisyUI integration
- Demo page at `/test/social`

### 🔧 Backend Integration Required
- SignalR/WebSocket hub implementation
- Database schema creation
- API endpoints for CRUD operations
- Authentication integration
- Content moderation system

### 📱 Demo Access
Visit `http://localhost:3001/test/social` to see all components in action with simulated real-time updates.
