# Office Open XML Technical Reference for PowerPoint

**Important: Read this entire document before starting.** Critical XML schema rules and formatting requirements are covered throughout. Incorrect implementation can create invalid PPTX files that PowerPoint cannot open.

## Technical Guidelines

### Schema Compliance
- **Element ordering in `<p:spTree>`: `<p:nvGrpSpPr>`, `<p:grpSpPr>`, `<p:sp>`**
- **Whitespace**: Add `xml:space='preserve'` to `<a:t>` elements with leading/trailing spaces
- **Unicode**: Escape characters in ASCII content: `"` becomes `"`
- **Images**: Add to `ppt/media/`, reference in slide XML, set dimensions to fit slide bounds
- **Relationships**: Update `ppt/slides/_rels/slideN.xml.rels` for each slide's resources
- **Dirty attribute**: Add `dirty="0"` to `<p:sld>` and `<p:sldMaster>` elements to indicate clean state

## Presentation Structure

### Basic Slide Structure
```xml
<p:sld>
    <p:cSld>
        <p:spTree>
            <p:nvGrpSpPr>...</p:nvGrpSpPr>
            <p:grpSpPr>...</p:grpSpPr>
            <!-- Slide content (shapes, text boxes, images) goes here -->
        </p:spTree>
    </p:cSld>
</p:sld>
```

### Text Box / Shape with Text
```xml
<p:sp>
    <p:nvSpPr>...</p:nvSpPr>
    <p:spPr>...</p:spPr>
    <p:txBody>
        <a:bodyPr/>
        <a:lstStyle/>
        <a:p>
            <a:r>
                <a:t>Slide Title</a:t>
            </a:r>
        </a:p>
    </p:txBody>
</p:sp>
```

### Text Formatting
```xml
<a:p>
    <a:r>
        <a:rPr b="1"><a:t>Bold Text</a:t></a:rPr>
    </a:r>
    <a:r>
        <a:rPr i="1"><a:t>Italic Text</a:t></a:rPr>
    </a:r>
    <a:r>
        <a:rPr u="sng"><a:t>Underlined</a:t></a:rPr>
    </a:r>
    <a:r>
        <a:rPr highlight="yellow"><a:t>Highlighted Text</a:t></a:rPr>
    </a:r>
    <a:r>
        <a:rPr>
            <a:solidFill>
                <a:srgbClr val="FF0000"/>
            </a:solidFill>
            <a:latin typeface="Arial"/>
            <a:sz val="2400"/>
        </a:rPr>
        <a:t>Colored Arial 24pt</a:t>
    </a:r>
    <a:r>
        <a:rPr>
            <!-- Nested formatting -->
        </a:rPr>
        <a:t>Formatted text</a:t>
    </a:r>
</a:p>
```

### Lists
```xml
<a:p>
    <a:pPr lvl="0"/>
    <a:r><a:t>First bullet point</a:t></a:r>
</a:p>
<a:p>
    <a:pPr lvl="0"/>
    <a:r><a:t>First numbered item</a:t></a:r>
</a:p>
<a:p>
    <a:pPr lvl="1"/>
    <a:r><a:t>Indented bullet</a:t></a:r>
</a:p>
```

### Shapes
```xml
<p:sp>
    <p:nvSpPr>...</p:nvSpPr>
    <p:spPr>
        <a:xfrm>...</a:xfrm>
        <a:prstGeom prst="rect">
            <a:avLst/>
        </a:prstGeom>
        <a:solidFill>
            <a:srgbClr val="4472C4"/>
        </a:solidFill>
    </p:spPr>
</p:sp>
```

### Images
```xml
<p:pic>
    <p:nvPicPr>...</p:nvPicPr>
    <p:blipFill>
        <a:blip r:embed="rId2"/>
        <a:stretch>
            <a:fillRect/>
        </a:stretch>
    </p:blipFill>
    <p:spPr>
        <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="9144000" cy="6858000"/>
        </a:xfrm>
        <a:prstGeom prst="rect">
            <a:avLst/>
        </a:prstGeom>
    </p:spPr>
</p:pic>
```

### Tables
```xml
<p:graphicFrame>
    <p:nvGraphicFramePr>...</p:nvGraphicFramePr>
    <p:xfrm>...</p:xfrm>
    <a:graphic>
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">
            <a:tbl>
                <a:tblPr/>...
                <a:tr>...
                    <a:tc>...
                        <a:txBody>
                            <a:p><a:r><a:t>Cell 1</a:t></a:r></a:p>
                        </a:txBody>
                    </a:tc>
                    <a:tc>...
                        <a:txBody>
                            <a:p><a:r><a:t>Cell 2</a:t></a:r></a:p>
                        </a:txBody>
                    </a:tc>
                </a:tr>
            </a:tbl>
        </a:graphicData>
    </a:graphic>
</p:graphicFrame>
```

### Slide Layouts
```xml
<p:sldLayout>
    <p:cSld>...</p:cSld>
    <p:clrMapOvr>...</p:clrMapOvr>
</p:sldLayout>
```

## File Updates

When adding content, update these files:

**`ppt/_rels/presentation.xml.rels`:**
```xml
<Relationships>
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>
    <!-- Add more slide relationships as needed -->
</Relationships>
```

**`ppt/slides/_rels/slide1.xml.rels`:**
```xml
<Relationships>
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/>
    <!-- Add media relationships for this slide -->
</Relationships>
```

**`[Content_Types].xml`:**
```xml
<Types>
    <Default Extension="xml" ContentType="application/xml"/>
    <Default Extension="png" ContentType="image/png"/>
    <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
    <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
    <!-- Declare all slides -->
</Types>
```

**`ppt/presentation.xml`:**
```xml
<p:presentation>
    <p:sldIdLst>
        <p:sldId id="256" r:id="rId1"/>
        <p:sldId id="257" r:id="rId2"/>
    </p:sldIdLst>
    <p:sldMasterIdLst>...</p:sldMasterIdLst>
</p:presentation>
```

**`docProps/app.xml`:** Update slide count and statistics
```xml
<Properties>
    <Slides>2</Slides>
    <Words>10</Words>
    <Characters>50</Characters>
</Properties>
```

## Slide Operations

### Adding a New Slide

When adding a slide to the end of the presentation:

1. **Create the slide file** (`ppt/slides/slideN.xml`)
2. **Update `[Content_Types].xml`**: Add Override for the new slide
3. **Update `ppt/_rels/presentation.xml.rels`**: Add relationship for the new slide
4. **Update `ppt/presentation.xml`**: Add slide ID to `<p:sldIdLst>`
5. **Create slide relationships** (`ppt/slides/_rels/slideN.xml.rels`) if needed
6. **Update `docProps/app.xml`**: Increment slide count and update statistics (if present)

### Duplicating a Slide

1. Copy the source slide XML file with a new name
2. Update all IDs in the new slide to be unique
3. Follow the "Adding a New Slide" steps above
4. **CRITICAL**: Remove or update any notes slide references in `_rels` files
5. Remove references to unused media files

### Reordering Slides

1. **Update `ppt/presentation.xml`**: Reorder `<p:sldId>` elements in `<p:sldIdLst>`
2. The order of `<p:sldId>` elements determines slide order
3. Keep slide IDs and relationship IDs unchanged

Example:
```xml
<p:sldIdLst>
    <p:sldId id="257" r:id="rId2"/> <!-- Now slide 1 -->
    <p:sldId id="256" r:id="rId1"/> <!-- Now slide 2 -->
</p:sldIdLst>
```

### Deleting a Slide

1. **Remove from `ppt/presentation.xml`**: Delete the `<p:sldId>` entry
2. **Remove from `ppt/_rels/presentation.xml.rels`**: Delete the relationship
3. **Remove from `[Content_Types].xml`**: Delete the Override entry
4. **Delete files**: Remove `ppt/slides/slideN.xml` and `ppt/slides/_rels/slideN.xml.rels`
5. **Update `docProps/app.xml`**: Decrement slide count and update statistics
6. **Clean up unused media**: Remove orphaned images from `ppt/media/`

Note: Don't renumber remaining slides - keep their original IDs and filenames.

## Common Errors to Avoid

- **Encodings**: Escape unicode characters in ASCII content: `"` becomes `"`
- **Images**: Add to `ppt/media/` and update relationship files
- **Lists**: Omit bullets from list headers
- **IDs**: Use valid hexadecimal values for UUIDs
- **Themes**: Check all themes in `theme` directory for colors

## Validation Checklist for Template-Based Presentations

### Before Packing, Always:

- **Clean unused resources**: Remove unreferenced media, fonts, and notes directories
- **Fix Content_Types.xml**: Declare ALL slides, layouts, and themes present in the package
- **Fix relationship IDs**:
  - Remove font embed references if not using embedded fonts
- **Remove broken references**: Check all `_rels` files for references to deleted resources

### Common Template Duplication Pitfalls:

- Multiple slides referencing the same notes slide after duplication
- Image/media references from template slides that no longer exist
- Font embedding references when fonts aren't included
- Missing slideLayout declarations for layouts 12-25
- docProps directory may not unpack - this is optional
