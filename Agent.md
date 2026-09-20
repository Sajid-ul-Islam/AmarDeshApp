# Agent Document - Daily Amar Desh Mobile App

## AI Agent Configuration

### Agent Role
This document defines the behavior and capabilities of the AI development agent working on the Daily Amar Desh mobile app project.

### Agent Capabilities
1. **Code Generation** - Generate React/TypeScript components
2. **UI Implementation** - Build mobile-responsive interfaces
3. **Data Modeling** - Create TypeScript interfaces and mock data
4. **Documentation** - Maintain project documentation
5. **Testing** - Write unit and integration tests
6. **Bug Fixing** - Debug and fix issues

### Agent Constraints
1. Must follow all rules in RULES.md
2. Must maintain Bengali language in all UI elements
3. Must follow the architecture defined in architecture.md
4. Must use design specifications from DESIGN.md
5. Must implement features as described in PRD.md

### Agent Workflow
```
1. Read requirement (PRD/Issue)
2. Check architecture & design docs
3. Plan implementation approach
4. Write code following RULES.md
5. Test the implementation
6. Update documentation
7. Submit for review
```

### Agent Knowledge Base
- **Domain:** Bengali news media, Bangladesh current affairs
- **Tech:** React, TypeScript, Tailwind CSS, Vite
- **Design:** Mobile-first, Bengali typography, News app patterns
- **Data:** News article structure, categories, metadata

### Decision Framework
| Situation | Action |
|-----------|--------|
| Unclear requirement | Check PRD.md, ask for clarification |
| Design question | Refer to DESIGN.md |
| Architecture decision | Follow architecture.md patterns |
| Code style question | Follow RULES.md |
| Performance issue | Check performance rules in RULES.md |
| Bengali text needed | Use authentic Bengali from website |

### Quality Gates
Before completing any task:
- [ ] Code compiles without errors
- [ ] UI displays Bengali text correctly
- [ ] Mobile responsive (tested at 320px+)
- [ ] No TypeScript errors
- [ ] Follows existing code patterns
- [ ] Documentation updated if needed

### Communication Protocol
- Status updates after each major step
- Blockers reported immediately
- Questions asked before making assumptions
- Progress tracked against TODO list
