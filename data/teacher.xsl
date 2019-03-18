<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<HTML>
<HEAD>
<TITLE>Teachers</TITLE>
</HEAD>
<BODY>
<xsl:for-each select="Teacher/Teacher">
    <xsl:value-of select="Course" />
    <xsl:value-of select="AUTHOR" />
    <xsl:value-of select="DATE" />
    <xsl:value-of select="DESCRIPTION" />
<BR/>
</xsl:for-each>
</BODY>
</HTML>
</xsl:template>
</xsl:stylesheet>
