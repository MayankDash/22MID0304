import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface FilterBarProps {
  type: string;
  priority: string;
  isRead: boolean | null;
  studentId: string;
  onTypeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onIsReadChange: (value: boolean | null) => void;
  onStudentIdChange: (value: string) => void;
}

function FilterBar({
  type,
  priority,
  isRead,
  studentId,
  onTypeChange,
  onPriorityChange,
  onIsReadChange,
  onStudentIdChange,
}: FilterBarProps) {
  const handleTypeChange = (event: SelectChangeEvent) => {
    onTypeChange(event.target.value);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    onPriorityChange(event.target.value);
  };

  const handleReadChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value === "all") return onIsReadChange(null);
    onIsReadChange(value === "read");
  };

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #f0e3d5",
        background: "#fffdf8",
        animation: "fadeUp 700ms ease",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
      </Typography>
      <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={handleTypeChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={handlePriorityChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Read</InputLabel>
          <Select
            value={isRead === null ? "all" : isRead ? "read" : "unread"}
            label="Read"
            onChange={handleReadChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Student ID (live feed)"
          value={studentId}
          onChange={(event) => onStudentIdChange(event.target.value)}
          fullWidth
        />
      </Stack>
    </Box>
  );
}

export default FilterBar;
