# Ring IG v1 - Code Analysis Report

## 1. Architecture Overview
- The application appears to be an AI-powered image generation platform
- Built using React with modern hooks and components
- Uses Supabase for backend services (storage, authentication, database)
- Follows a modular architecture with clear separation of concerns

## 2. Key Components

### Core Components:
1. `ImageGenerator.jsx` (Main Page)
2. `ImageGeneratorContent.jsx` (Layout Component)
3. `ImageGeneratorSettings.jsx` (Settings Panel)

### Utility Components:
- ImageGallery
- BottomNavbar
- MobileNotificationsMenu
- ImageDetailsDialog
- FullScreenImageView

## 3. Custom Hooks

### Primary Hooks:
1. `useImageGeneration.js`
   - Handles image generation logic
   - Integrates with HuggingFace API
   - Manages credit system
   - Handles file uploads to Supabase

2. `useImageHandlers.js`
   - Manages image-related actions (download, remix, discard)
   - Handles navigation and state updates

3. `useImageGeneratorState.js`
   - Central state management
   - Manages all image generator settings and UI states

## 4. Key Features

### Image Generation:
- Multiple quality options (HD, HD+, 4K)
- Aspect ratio control
- Seed management
- Multiple model support
- Batch generation capability

### Image Management:
- Public/Private image toggle
- Image remixing
- Download functionality
- Image deletion
- Full-screen view
- Image details dialog

### User Features:
- Credit system
- NSFW content toggle
- Mobile responsive design
- Profile management
- Notifications system

## 5. Technical Implementation Details

### State Management:
- Uses React hooks for local state
- Custom hook (useImageGeneratorState) for centralized state
- Query client for data fetching and caching

### API Integration:
- HuggingFace API for image generation
- Supabase for:
  - File storage
  - User authentication
  - Database operations
  - API key management

### Security Features:
- API key rotation
- Secure file storage
- User authentication
- Private image support

## 6. Notable Design Patterns

1. **Component Composition**
   - Clear hierarchy of components
   - Separation of concerns
   - Reusable UI components

2. **Custom Hook Pattern**
   - Logic separation
   - Reusable functionality
   - State management

3. **Responsive Design**
   - Mobile-first approach
   - Adaptive layouts
   - Device-specific features

## 7. Areas for Potential Improvement

1. **Performance Optimization**
   - Image caching
   - Lazy loading implementation
   - Bundle size optimization

2. **Error Handling**
   - More comprehensive error states
   - Better error recovery mechanisms
   - User feedback improvements

3. **State Management**
   - Consider using global state management
   - Reduce prop drilling
   - Optimize re-renders

## 8. Dependencies and Integration

### Key External Services:
- Supabase
- HuggingFace API

### Main Libraries:
- React
- React Router
- Tanstack Query
- Sonner (for toasts)

## 9. Code Quality

### Strengths:
- Well-organized file structure
- Consistent coding patterns
- Good separation of concerns
- Clear naming conventions

### Areas for Review:
- Some duplicate code in handlers
- Complex state management
- Potential memory leaks in useEffect

## 10. Image Generation Queue System

### Requirements:
1. Queue-based Generation:
   - Images are added to a generation queue when create button is clicked
   - Only one image generates at a time
   - Next image starts after current one completes
   - Queue visible in dropdown/drawer UI

2. Multiple Image Handling:
   - When using ImageCountChooser (2,3,4 images)
   - Each image added as separate entry in queue
   - Same workflow as single image generation
   - Sequential processing of queue

### Implementation Strategy:
1. Queue Management:
   - Add queue state in useImageGeneratorState
   - Track status: 'pending', 'generating', 'completed'
   - First-in-first-out (FIFO) processing

2. UI Updates:
   - Show queue in GeneratingImagesDrawer/Dropdown
   - Display current generation status
   - Show pending items in queue

3. Generation Logic:
   - Process one image at a time
   - Auto-start next image after completion
   - Handle errors without breaking queue

## 11. Inference Steps Implementation

### Overview:
- Added default inference steps for each model in modelConfig
- Steps vary based on model type and quality requirements
- No UI control - fixed values per model

### Implementation Details:
1. Model Configuration:
   - Fast models (turbo, Illustturbo): 20 steps
   - Standard models (flux, anime): 25 steps
   - High-quality models (sd35l, ultra): 30-35 steps
   - NSFW models: 25-30 steps

2. API Integration:
   - Added num_inference_steps parameter to API calls
   - Default fallback to 30 steps if not specified
   - Included in parameters object for HuggingFace API

3. Model-specific Settings:
   - Turbo models: 20 steps for faster generation
   - Art models (vector, pixel): 20 steps
   - Standard models: 25 steps for balance
   - Quality-focused models: 30+ steps

### Benefits:
1. Optimized Generation:
   - Faster generation for simple models
   - Better quality for complex models
   - Balanced approach for standard use cases

2. Model-specific Tuning:
   - Each model uses optimal steps
   - Maintains quality standards
   - Efficient resource usage

## 12. Persistent Image Generation Across Navigation

### Current Issue:
1. Image Generation State Loss:
   - Generation tracking lost on page navigation
   - Generation cancels when leaving generator page
   - ~2 minute generation time is significant
   - Queue state not persisted across routes

### Potential Solutions:

1. Supabase-based Queue System:
   - Store generation queue in Supabase table
   - Track status: pending, generating, completed
   - Benefits:
     * Persistent across sessions/navigation
     * Real-time updates via subscriptions
     * Reliable state management
   - Considerations:
     * Need queue table schema
     * Handle concurrent users
     * Manage API rate limits

2. Global State Management:
   - Move generation state to app-level
   - Use React Context or state manager
   - Benefits:
     * Maintains state during navigation
     * Simpler implementation
   - Limitations:
     * Lost on page refresh
     * No persistence between sessions

3. Background Worker Approach:
   - Use Supabase Edge Functions
   - Queue jobs for processing
   - Benefits:
     * Fully decoupled from frontend
     * Robust error handling
   - Challenges:
     * Complex implementation
     * Additional infrastructure needed

### Recommended Approach:
Hybrid solution combining:
1. Supabase Queue Table:
   ```sql
   generation_queue (
     id uuid primary key
     user_id uuid references auth.users
     prompt text
     model text
     status text
     created_at timestamp
     started_at timestamp
     completed_at timestamp
     image_url text
     error text
     parameters jsonb
   )
   ```

2. Real-time Subscriptions:
   - Subscribe to queue updates
   - Update UI across all routes
   - Handle status changes

3. Global Context:
   - Share queue state app-wide
   - Manage UI updates efficiently
   - Handle navigation gracefully

### Implementation Strategy:
1. Database Setup:
   - Create queue table
   - Add necessary indexes
   - Setup RLS policies

2. Frontend Integration:
   - Create QueueContext provider
   - Setup Supabase subscriptions
   - Update UI components

3. Generation Flow:
   - Add to queue table
   - Monitor status via subscription
   - Update UI across routes
   - Handle completion/errors

4. Error Handling:
   - Track failed generations
   - Implement retry mechanism
   - Clear stuck items
   - User notifications

## 13. Server-Side Image Generation Processing

### Overview:
- Move image generation process to Supabase Edge Functions
- Complete independence from client-side state
- Fully automated background processing

### Architecture:

1. Supabase Edge Function Setup:
   ```javascript
   // generation-worker.js
   async function processGeneration(queueItem) {
     // 1. HuggingFace API Call
     // 2. Image Result Fetch
     // 3. Supabase Storage Upload
     // 4. Update Queue Status
   }
   ```

2. Components:
   a) Queue Management:
   ```sql
   generation_queue (
     id uuid primary key,
     user_id uuid references auth.users,
     prompt text,
     model text,
     status text,
     created_at timestamp default now(),
     started_at timestamp,
     completed_at timestamp,
     image_url text,
     error text,
     parameters jsonb,
     retry_count int default 0,
     last_error text,
     processing_id text
   )
   ```

   b) Database Functions:
   ```sql
   -- Trigger function to process new queue items
   create function process_generation_queue()
   returns trigger as $$
   begin
     -- Invoke Edge Function
     -- Update processing status
     return new;
   end;
   $$ language plpgsql;
   ```

### Flow:
1. Client-Side:
   - Add generation request to queue
   - Subscribe to status updates
   - Display progress/results

2. Server-Side:
   - Database trigger detects new queue item
   - Edge function processes generation:
     * Make HuggingFace API call
     * Wait for completion
     * Download result
     * Upload to Supabase storage
     * Update queue status
   - Handle retries and errors

3. Benefits:
   - Generation continues if user closes browser
   - Reliable completion handling
   - Automatic retries
   - Better error recovery
   - Reduced client-side complexity

4. Implementation Requirements:
   a) Edge Function:
   - HuggingFace API integration
   - Error handling
   - Retry logic
   - Storage management

   b) Database:
   - Queue table
   - Processing triggers
   - Status tracking
   - Cleanup procedures

   c) Security:
   - RLS policies
   - API key management
   - Rate limiting
   - Access control

5. Monitoring:
   - Track processing times
   - Monitor error rates
   - Queue length metrics
   - Resource usage

6. Error Recovery:
   - Automatic retry for failed items
   - Dead letter queue for investigation
   - Alert system for issues
   - Manual intervention options

### Implementation Priority:
1. Setup Edge Function infrastructure
2. Create queue processing logic
3. Implement database triggers
4. Add monitoring and alerts
5. Build retry mechanism
6. Create cleanup procedures

### Considerations:
1. Cost:
   - Edge Function execution time
   - Database operations
   - Storage usage
   - API rate limits

2. Performance:
   - Concurrent processing limits
   - Queue throttling
   - Resource allocation
   - Response times

3. Maintenance:
   - Log management
   - Error tracking
   - Version updates
   - Backup procedures

## 14. Edge Function Limitations & Revised Architecture

### Edge Function Constraints:
1. Timeout Limits:
   - Supabase Edge Functions: 50 seconds max
   - Standard image generation: 120+ seconds
   - Not suitable for direct API calls

### Revised Architecture Options:

1. Webhook-Based Solution:
   ```javascript
   // Step 1: Edge Function initiates generation
   async function startGeneration(queueItem) {
     const response = await fetch(modelConfig.apiUrl, {
       headers: { 
         'Authorization': `Bearer ${apiKey}`,
         'X-Callback-URL': webhookUrl // HuggingFace callback
       }
     });
     return response.json();
   }

   // Step 2: Webhook Endpoint (Separate Edge Function)
   async function handleWebhook(request) {
     const { imageData, queueId } = request.body;
     // Process result and update queue
   }
   ```

2. Polling-Based Solution:
   ```javascript
   // Step 1: Edge Function starts generation
   async function initiateGeneration(queueItem) {
     const { taskId } = await startHFGeneration();
     await updateQueue({ 
       status: 'processing',
       processing_id: taskId 
     });
   }

   // Step 2: Scheduled Function (Every 30s)
   async function checkPendingGenerations() {
     const pending = await getPendingTasks();
     for (const task of pending) {
       const status = await checkHFStatus(task.processing_id);
       if (status.completed) {
         await processResult(task, status);
       }
     }
   }
   ```

### Recommended Architecture:

1. Split Processing:
   a) Generation Initiation:
      - Edge Function starts HF generation
      - Records task ID in queue
      - Quick operation (<50s)

   b) Status Monitoring:
      - Scheduled function checks pending tasks
      - Updates queue status
      - Downloads & uploads completed images
      - Handles retries and errors

2. Database Schema Update:
   ```sql
   generation_queue (
     -- Previous fields...
     task_id text,          -- HuggingFace task ID
     last_checked timestamp, -- Last status check
     next_check timestamp,  -- Next scheduled check
     check_count int,       -- Number of status checks
     webhook_url text       -- Optional webhook URL
   )
   ```

3. Processing States:
   - 'queued': Initial state
   - 'initiated': HF API call made
   - 'processing': Generation in progress
   - 'downloading': Fetching result
   - 'uploading': Saving to storage
   - 'completed': Final state
   - 'failed': Error state

4. Implementation Components:
   a) Initiation Function:
      - Validates request
      - Starts HF generation
      - Updates queue entry
      - Fast execution (<50s)

   b) Status Checker:
      - Runs every 30 seconds
      - Checks pending generations
      - Updates status and progress
      - Handles completions

   c) Result Processor:
      - Downloads completed images
      - Uploads to storage
      - Updates queue status
      - Sends notifications

5. Error Handling:
   - Retry failed API calls
   - Track check attempts
   - Handle timeout cases
   - Manage stuck generations

6. Monitoring:
   - Track generation times
   - Monitor success rates
   - Alert on failures
   - Log processing metrics

### Benefits:
1. Reliable Processing:
   - No timeout issues
   - Robust status tracking
   - Automatic recovery
   - Complete audit trail

2. Scalability:
   - Handles multiple generations
   - Efficient resource usage
   - Predictable performance
   - Easy to monitor

3. User Experience:
   - Real-time status updates
   - Reliable completion
   - Progress tracking
   - Error notifications

## 15. Alternative Server Solutions

### Available Options:

1. Serverless Platforms with Extended Timeouts:
   ```
   Platform          Max Timeout    Cost Model         Setup Complexity
   AWS Lambda        15 minutes     Pay per use        Medium
   GCP Functions     9 minutes      Pay per use        Medium
   Azure Functions   10 minutes     Pay per use        Medium
   DO Functions      10 minutes     Pay per use        Low
   Railway.app       Unlimited      Resource based     Low
   Render.com        Unlimited      Resource based     Low
   ```

2. Self-Hosted Solutions:
   ```
   Option            Advantages                     Considerations
   VPS + Node.js     Full control, No timeouts     Server management
   Docker Container  Portable, Scalable            Container orchestration
   PM2 + Node.js     Process management            Server maintenance
   ```

### Recommended Solution:
Railway.app or Render.com because:
1. No timeout constraints
2. Simple deployment process
3. Built-in CI/CD
4. Cost-effective for our use case
5. Good monitoring tools

### Implementation Approach:

1. Server Setup:
   ```javascript
   // server.js
   const express = require('express');
   const app = express();
   
   app.post('/generate', async (req, res) => {
     const { queueId } = req.body;
     res.status(200).json({ received: true });
     
     // Process in background
     processGeneration(queueId);
   });
   
   async function processGeneration(queueId) {
     // 1. Fetch queue item from Supabase
     // 2. Make HF API call
     // 3. Wait for completion
     // 4. Upload to storage
     // 5. Update queue status
   }
   ```

2. Security:
   - API key authentication
   - Rate limiting
   - IP whitelisting
   - Request validation

3. Integration Flow:
   a) Edge Function Role:
      - Receive generation request
      - Add to queue
      - Trigger worker server
      - Fast completion (<50s)

   b) Worker Server Role:
      - Handle long-running process
      - Manage HF API calls
      - Process results
      - Update Supabase

4. Error Handling:
   - Automatic retries
   - Error reporting
   - Status monitoring
   - Alert system

5. Monitoring:
   - Server health checks
   - Process duration tracking
   - Error rate monitoring
   - Resource usage stats

### Cost Analysis:
1. Railway.app:
   - $5-20/month based on usage
   - Includes monitoring
   - Auto-scaling available

2. Render.com:
   - $7-15/month for basic instance
   - Free tier available
   - Pay for what you use

### Next Steps:
1. Choose platform (Railway/Render)
2. Setup worker server
3. Implement security measures
4. Create monitoring system
5. Test with real workloads

## 16. Free Hosting Solutions

### Available Free Options:

1. Oracle Cloud Free Tier:
   ```
   Features:
   - 2 AMD-based Compute VMs
   - 24/7 availability
   - 1 GB RAM per VM
   - 4 ARM-based Ampere A1 cores
   - 24 GB RAM total
   - 200 GB block storage
   - COMPLETELY FREE forever
   ```

2. Google Cloud Free Tier:
   ```
   Features:
   - 1 e2-micro VM instance
   - 1 GB RAM
   - 30 GB HDD
   - Available in us-west1, us-central1, us-east1
   - COMPLETELY FREE forever
   ```

3. Heroku Eco Plan (GitHub Student):
   ```
   Features:
   - Free with GitHub Student
   - 1000 dyno hours
   - No sleep mode
   - Suitable for worker processes
   ```

4. Free Code Hosting + Oracle VM:
   ```
   Architecture:
   GitHub Actions -> Oracle VM -> HF API
                  -> Supabase Storage
                  -> Queue Updates
   ```

### Recommended Solution:
Oracle Cloud Free Tier because:
1. Most generous free resources
2. No time limits
3. True 24/7 availability
4. Sufficient RAM for image processing
5. Multiple VMs available

### Implementation Plan:

1. Server Setup:
   ```javascript
   // Using PM2 for process management
   const express = require('express');
   const app = express();
   
   // Secure endpoints
   app.use(express.json());
   app.use((req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (apiKey !== process.env.WORKER_API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   });
   
   app.post('/generate', async (req, res) => {
     const { queueId } = req.body;
     res.status(200).json({ received: true });
     processGeneration(queueId);
   });
   ```

2. Deployment Steps:
   ```bash
   # Oracle Cloud Setup
   1. Create Oracle Account
   2. Setup VM Instance
   3. Install Node.js and PM2
   4. Setup SSL with Let's Encrypt
   5. Configure firewall
   ```

3. Security (Zero Cost):
   - Custom API key authentication
   - Rate limiting with Express
   - IP whitelist Supabase IPs
   - HTTPS with Let's Encrypt

4. Process Management:
   ```javascript
   // pm2 config
   module.exports = {
     apps: [{
       name: 'image-worker',
       script: 'server.js',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '500M',
       env: {
         NODE_ENV: 'production'
       }
     }]
   }
   ```

5. Monitoring (Free Tools):
   - PM2 monitoring
   - Server health checks
   - Custom logging system
   - Discord webhook alerts

### Architecture Benefits:
1. Cost: COMPLETELY FREE
2. Performance:
   - Dedicated VM
   - No timeout limits
   - Reliable processing
   - Good network speed

3. Reliability:
   - 24/7 availability
   - Auto-restart on crash
   - Process management
   - Error recovery

4. Maintenance:
   - Simple deployment
   - Easy updates
   - Basic monitoring
   - Backup options

### Next Steps:
1. Create Oracle Cloud account
2. Setup VM and networking
3. Deploy Node.js worker
4. Configure security
5. Test with real workload

## 17. Platform-Specific Free Solutions

### 1. Supabase Options:

a) Database Functions:
```sql
-- Long-running PG function with pg_background
CREATE FUNCTION process_image_generation()
RETURNS void AS $$
BEGIN
  PERFORM pg_background_launch('
    -- HF API call
    -- Store result
    -- Update status
  ');
END;
$$ LANGUAGE plpgsql;
```

b) pg_net Extension:
```sql
-- Make HTTP calls from Postgres
CREATE FUNCTION start_generation()
RETURNS void AS $$
BEGIN
  PERFORM net.http_post(
    'https://api-inference.huggingface.co/models/...',
    '{"inputs": "..."}',
    '{
      "Authorization": "Bearer ..."
    }'::jsonb
  );
END;
$$ LANGUAGE plpgsql;
```

### 2. GitHub Options:

a) GitHub Actions:
```yaml
name: Process Image Generation
on:
  repository_dispatch:
    types: [generate-image]

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 360  # 6 hours
    steps:
      - uses: actions/checkout@v2
      - name: Generate Image
        run: |
          # Call HF API
          # Upload to Supabase
          # Update status
```

b) GitHub Actions Workflow:
```yaml
name: Queue Processor
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:

jobs:
  process-queue:
    runs-on: ubuntu-latest
    steps:
      - name: Process Queue
        run: |
          # Check pending generations
          # Process each item
          # Update status
```

### 3. Vercel Options:

a) Serverless Functions:
```javascript
// pages/api/start-generation.js
export default async function handler(req, res) {
  // Start generation
  // Return immediately
  res.status(200).json({ started: true });
}
```

b) Edge Functions:
```javascript
// pages/api/check-status.js
export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  // Check generation status
  return new Response(JSON.stringify({ status }));
}
```

### Recommended Solution:
GitHub Actions because:
1. Free for public repositories
2. Long execution times (up to 6 hours)
3. Reliable infrastructure
4. Good monitoring
5. Easy integration

### Implementation Strategy:

1. Queue System:
```sql
-- Supabase table
create table generation_queue (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  prompt text,
  model text,
  status text default 'pending',
  created_at timestamp with time zone default now(),
  github_run_id text,
  parameters jsonb,
  result_url text
);
```

2. GitHub Action Workflow:
```yaml
name: Image Generation
on:
  repository_dispatch:
    types: [process-queue]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Process Queue
        run: |
          node process-queue.js
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
          HF_API_KEY: ${{ secrets.HF_API_KEY }}
```

3. Edge Function Trigger:
```javascript
// Supabase Edge Function
export async function trigger() {
  await fetch('https://api.github.com/repos/owner/repo/dispatches', {
    method: 'POST',
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      event_type: 'process-queue'
    })
  });
}
```

### Benefits:
1. Cost: FREE for public repos
2. Features:
   - 2000 minutes/month
   - 500MB storage
   - Unlimited queue processing
   - Good monitoring

3. Integration:
   - Easy setup with Supabase
   - Reliable execution
   - Status tracking
   - Error handling

4. Limitations:
   - Public repository required
   - API keys in secrets
   - Job concurrency limits
   - Monthly minutes cap

### Next Steps:
1. Create GitHub workflow
2. Setup Supabase queue table
3. Create trigger function
4. Implement queue processor
5. Add monitoring

## 18. GitHub Actions Implementation Plan

### Phase 1: Infrastructure Setup

1. Supabase Database:
   ```sql
   -- Generation Queue Table
   create table public.generation_queue (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references auth.users not null,
     prompt text not null,
     model text not null,
     status text not null default 'pending',
     created_at timestamp with time zone default now(),
     started_at timestamp with time zone,
     completed_at timestamp with time zone,
     github_run_id text,
     github_run_number integer,
     parameters jsonb not null default '{}',
     result_url text,
     error text,
     retry_count integer default 0,
     last_error text,
     last_retry_at timestamp with time zone
   );

   -- Indexes
   create index idx_generation_queue_status on public.generation_queue(status);
   create index idx_generation_queue_user on public.generation_queue(user_id);
   create index idx_generation_queue_created on public.generation_queue(created_at);

   -- RLS Policies
   alter table public.generation_queue enable row level security;

   -- Users can view their own generations
   create policy "Users can view own generations"
     on public.generation_queue for select
     using (auth.uid() = user_id);

   -- Users can insert their own generations
   create policy "Users can insert own generations"
     on public.generation_queue for insert
     with check (auth.uid() = user_id);
   ```

2. GitHub Repository Setup:
   ```bash
   # Repository Structure
   /
   ├── .github/
   │   └── workflows/
   │       ├── process-queue.yml    # Main workflow
   │       └── cleanup.yml          # Maintenance workflow
   ├── scripts/
   │   ├── process-queue.js         # Queue processor
   │   ├── huggingface.js          # HF API wrapper
   │   ├── supabase.js             # Supabase client
   │   └── utils.js                # Helper functions
   └── package.json
   ```

### Phase 2: Core Components

1. Queue Processor Workflow:
   ```yaml
   # .github/workflows/process-queue.yml
   name: Process Generation Queue
   on:
     repository_dispatch:
       types: [process-queue]
     schedule:
       - cron: '*/5 * * * *'  # Backup trigger
     workflow_dispatch:        # Manual trigger

   jobs:
     process:
       runs-on: ubuntu-latest
       timeout-minutes: 360
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - name: Process Queue
           run: node scripts/process-queue.js
           env:
             SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
             SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
             HF_API_KEY: ${{ secrets.HF_API_KEY }}
   ```

2. Queue Processing Script:
   ```javascript
   // scripts/process-queue.js
   async function processQueue() {
     // 1. Get pending generations
     const { data: pending } = await supabase
       .from('generation_queue')
       .select()
       .eq('status', 'pending')
       .order('created_at', { ascending: true })
       .limit(1);

     if (!pending?.length) return;

     // 2. Process each generation
     for (const item of pending) {
       try {
         // Update status
         await updateStatus(item.id, 'processing');

         // Generate image
         const result = await generateImage(item);

         // Upload to storage
         const url = await uploadResult(result);

         // Mark as complete
         await updateStatus(item.id, 'completed', { result_url: url });
       } catch (error) {
         await handleError(item, error);
       }
     }
   }
   ```

### Phase 3: Frontend Integration

1. React Context:
   ```javascript
   // src/contexts/GenerationQueueContext.jsx
   export const GenerationQueueProvider = ({ children }) => {
     const [queue, setQueue] = useState([]);
     const supabase = useSupabaseClient();

     useEffect(() => {
       // Subscribe to queue updates
       const channel = supabase
         .channel('generation_queue')
         .on('postgres_changes', {
           event: '*',
           schema: 'public',
           table: 'generation_queue'
         }, handleQueueUpdate)
         .subscribe();

       return () => {
         supabase.removeChannel(channel);
       };
     }, []);

     // ... rest of the implementation
   };
   ```

2. Queue Hook:
   ```javascript
   // src/hooks/useGenerationQueue.js
   export const useGenerationQueue = () => {
     const { queue, addToQueue, removeFromQueue } = useContext(GenerationQueueContext);
     const supabase = useSupabaseClient();

     const startGeneration = async (params) => {
       // Add to queue
       const { data, error } = await supabase
         .from('generation_queue')
         .insert([params])
         .select()
         .single();

       if (error) throw error;

       // Trigger GitHub Action
       await triggerGitHubAction();

       return data;
     };

     // ... other queue operations
   };
   ```

### Phase 4: Error Handling & Monitoring

1. Error Recovery:
   ```javascript
   // scripts/process-queue.js
   async function handleError(item, error) {
     const retryCount = (item.retry_count || 0) + 1;
     const shouldRetry = retryCount <= 3 && isRetryableError(error);

     await supabase
       .from('generation_queue')
       .update({
         status: shouldRetry ? 'pending' : 'failed',
         retry_count: retryCount,
         last_error: error.message,
         last_retry_at: shouldRetry ? new Date().toISOString() : null
       })
       .eq('id', item.id);
   }
   ```

2. Monitoring Workflow:
   ```yaml
   # .github/workflows/monitoring.yml
   name: Queue Monitoring
   on:
     schedule:
       - cron: '*/15 * * * *'

   jobs:
     monitor:
       runs-on: ubuntu-latest
       steps:
         - name: Check Queue Health
           run: node scripts/monitor-queue.js
         - name: Send Alerts
           if: failure()
           uses: actions/github-script@v6
           with:
             script: |
               // Send Discord/Email alerts
   ```

### Phase 5: Testing & Deployment

1. Test Cases:
   ```javascript
   // tests/queue.test.js
   describe('Generation Queue', () => {
     test('Successfully processes queue item', async () => {
       // Test queue processing
     });

     test('Handles API errors', async () => {
       // Test error handling
     });

     test('Respects rate limits', async () => {
       // Test rate limiting
     });
   });
   ```

2. Deployment Checklist:
   - [ ] Create Supabase tables and policies
   - [ ] Setup GitHub repository and secrets
   - [ ] Deploy Edge Functions
   - [ ] Test queue processing
   - [ ] Monitor initial generations
   - [ ] Setup alerts

### Phase 6: Optimization & Scaling

1. Performance Optimizations:
   - Batch processing when possible
   - Efficient status updates
   - Smart retry mechanisms
   - Resource usage optimization

2. Scaling Considerations:
   - Monitor GitHub Actions minutes
   - Track API rate limits
   - Optimize storage usage
   - Handle concurrent users

### Next Steps:
1. Begin with Phase 1: Database setup
2. Create basic GitHub workflow
3. Implement core processing logic
4. Add frontend integration
5. Setup monitoring
6. Deploy and test

## 19. Comprehensive Supabase Setup Plan

### 1. Authentication Setup:
```sql
-- Enable email auth, OAuth providers
-- Configure auth settings
auth.users (
  id uuid primary key,
  email text,
  created_at timestamp,
  last_sign_in timestamp,
  metadata jsonb
)
```

### 2. Database Tables:

a) User Profiles:
```sql
create table public.profiles (
  id uuid primary key references auth.users,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  is_pro boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_profiles_username on public.profiles(username);

-- RLS Policies
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

b) User Credits:
```sql
create table public.user_credits (
  user_id uuid primary key references auth.users,
  credits integer default 0,
  bonus_credits integer default 0,
  last_credit_update timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.user_credits enable row level security;

create policy "Users can view own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

create policy "Only system can insert/update credits"
  on public.user_credits for all
  using (auth.uid() = user_id);
```

c) Generated Images:
```sql
create table public.generated_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  prompt text not null,
  model text not null,
  image_url text not null,
  thumbnail_url text,
  width integer,
  height integer,
  is_public boolean default true,
  created_at timestamp with time zone default now(),
  metadata jsonb default '{}'::jsonb,
  likes_count integer default 0,
  views_count integer default 0,
  is_nsfw boolean default false
);

-- Indexes
create index idx_generated_images_user on public.generated_images(user_id);
create index idx_generated_images_public on public.generated_images(is_public);
create index idx_generated_images_created on public.generated_images(created_at);

-- RLS Policies
alter table public.generated_images enable row level security;

create policy "Public images are viewable by everyone"
  on public.generated_images for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can insert own images"
  on public.generated_images for insert
  with check (auth.uid() = user_id);

create policy "Users can update own images"
  on public.generated_images for update
  using (auth.uid() = user_id);
```

d) Generation Queue:
```sql
create table public.generation_queue (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  prompt text not null,
  model text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  github_run_id text,
  github_run_number integer,
  parameters jsonb not null default '{}',
  result_url text,
  error text,
  retry_count integer default 0,
  last_error text,
  last_retry_at timestamp with time zone,
  width integer,
  height integer,
  is_public boolean default true,
  is_nsfw boolean default false,
  priority integer default 0
);

-- Indexes
create index idx_generation_queue_status on public.generation_queue(status);
create index idx_generation_queue_user on public.generation_queue(user_id);
create index idx_generation_queue_created on public.generation_queue(created_at);

-- RLS Policies
alter table public.generation_queue enable row level security;

create policy "Users can view own queue items"
  on public.generation_queue for select
  using (auth.uid() = user_id);

create policy "Users can insert own queue items"
  on public.generation_queue for insert
  with check (auth.uid() = user_id);
```

e) User Follows:
```sql
create table public.user_follows (
  follower_id uuid references auth.users not null,
  following_id uuid references auth.users not null,
  created_at timestamp with time zone default now(),
  primary key (follower_id, following_id)
);

-- Indexes
create index idx_user_follows_follower on public.user_follows(follower_id);
create index idx_user_follows_following on public.user_follows(following_id);

-- RLS Policies
alter table public.user_follows enable row level security;

create policy "Users can view follows"
  on public.user_follows for select
  using (true);

create policy "Users can manage own follows"
  on public.user_follows for all
  using (auth.uid() = follower_id);
```

### 3. Storage Buckets:

```sql
-- User Images Bucket
insert into storage.buckets (id, name)
values ('user-images', 'user-images');

-- User Avatars Bucket
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

-- Storage Policies
create policy "Images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'user-images');

create policy "Users can upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'user-images' and
    auth.uid() = owner
  );

create policy "Avatar access"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Avatar upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid() = owner
  );
```

### 4. Functions:

a) Credit Management:
```sql
create or replace function handle_credit_usage()
returns trigger as $$
begin
  -- Deduct credits when generation starts
  update public.user_credits
  set credits = credits - 1
  where user_id = NEW.user_id
  and credits > 0;
  return NEW;
end;
$$ language plpgsql;

create trigger on_generation_start
  after update of status on public.generation_queue
  for each row
  when (NEW.status = 'processing')
  execute function handle_credit_usage();
```

b) Image Stats:
```sql
create or replace function increment_view_count(image_id uuid)
returns void as $$
begin
  update public.generated_images
  set views_count = views_count + 1
  where id = image_id;
end;
$$ language plpgsql;
```

### 5. Edge Functions:

a) Queue Trigger:
```typescript
// supabase/functions/trigger-generation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { id } = await req.json()
  
  // Trigger GitHub Action
  const response = await fetch(
    'https://api.github.com/repos/owner/repo/dispatches',
    {
      method: 'POST',
      headers: {
        'Authorization': `token ${Deno.env.get('GITHUB_TOKEN')}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        event_type: 'process-queue',
        client_payload: { queue_id: id }
      })
    }
  )

  return new Response(JSON.stringify({ triggered: true }))
})
```

### 6. Realtime:

```sql
-- Enable realtime for tables
alter publication supabase_realtime
add table public.generation_queue;

alter publication supabase_realtime
add table public.generated_images;
```

### 7. Initial Data:

```sql
-- Insert default credits for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  
  insert into public.user_credits (user_id, credits, bonus_credits)
  values (new.id, 10, 0);
  
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Next Steps:
1. Create new Supabase project
2. Execute schema setup
3. Configure auth settings
4. Create storage buckets
5. Deploy edge functions
6. Test complete setup
