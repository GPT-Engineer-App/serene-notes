import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Input, Textarea, VStack, Text, useColorModeValue, IconButton, Heading } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaSave, FaEdit } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const fetchedNotes = await client.getWithPrefix("note:");
    setNotes(fetchedNotes || []);
    if (fetchedNotes && fetchedNotes.length > 0) {
      setActiveNote(fetchedNotes[0]);
      setNoteContent(fetchedNotes[0].value.content);
    }
  };

  const handleNoteSelect = (note) => {
    setActiveNote(note);
    setNoteContent(note.value.content);
    setIsEditing(false);
  };

  const handleNoteAdd = async () => {
    const newNote = {
      key: `note:${Date.now()}`,
      value: { content: "" },
    };
    await client.set(newNote.key, newNote.value);
    fetchNotes();
  };

  const handleNoteDelete = async () => {
    if (activeNote) {
      await client.delete(activeNote.key);
      fetchNotes();
    }
  };

  const handleNoteSave = async () => {
    if (activeNote) {
      await client.set(activeNote.key, { content: noteContent });
      fetchNotes();
      setIsEditing(false);
    }
  };

  const handleNoteEdit = () => {
    setIsEditing(true);
  };

  const sidebarBg = useColorModeValue("blue.50", "blue.900");
  const noteBg = useColorModeValue("white", "gray.700");

  return (
    <Flex height="100vh">
      <VStack width="300px" p={4} borderRight="1px" borderColor="gray.200" bg={sidebarBg} spacing={4} alignItems="stretch">
        <Heading size="md">Notes</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleNoteAdd}>
          Add Note
        </Button>
        {notes.map((note) => (
          <Button key={note.key} justifyContent="flex-start" variant={note.key === activeNote?.key ? "solid" : "ghost"} onClick={() => handleNoteSelect(note)}>
            {note.value.content.substring(0, 20) || "New Note"}
          </Button>
        ))}
      </VStack>
      <VStack flex="1" p={4} spacing={4} alignItems="stretch">
        {activeNote && (
          <>
            <Flex justifyContent="space-between">
              <IconButton icon={<FaEdit />} isRound onClick={handleNoteEdit} aria-label="Edit note" />
              <IconButton icon={<FaTrash />} isRound colorScheme="red" onClick={handleNoteDelete} aria-label="Delete note" />
            </Flex>
            <Textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Start typing here..." bg={noteBg} isReadOnly={!isEditing} minHeight="70vh" />
            {isEditing && (
              <Button leftIcon={<FaSave />} colorScheme="blue" onClick={handleNoteSave}>
                Save
              </Button>
            )}
          </>
        )}
      </VStack>
    </Flex>
  );
};

export default Index;
