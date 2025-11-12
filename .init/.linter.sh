#!/bin/bash
cd /home/kavia/workspace/code-generation/unified-e-commerce-platform-186146-186156/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

